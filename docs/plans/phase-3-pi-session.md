# Phase 3: Pi SDK Session Wrapper

**Depends on:** [Phase 1](phase-1-scaffolding.md), [Phase 2](phase-2-config.md)
**Next phase:** [Phase 6 — Runner](phase-6-runner.md)

---

## Task 3.1: Create BenchmarkSession class

**Context:**
This is the core integration with Pi's SDK (`@mariozechner/pi-coding-agent`). It wraps `createAgentSession()` to give the benchmark runner a clean interface: send a prompt, get back metrics. The session must be "bare" — matching v1's pi-coding-agent setup with default tools only (read, write, edit, bash), no skills, no extensions, no prompt templates, no AGENTS.md context injection.

Key SDK facts to know before implementing:
- `DefaultResourceLoader` does NOT accept override callbacks. To get a bare session, point `agentDir` at an empty directory that contains only `models.json` — the loader will find no skills, extensions, prompts, or AGENTS.md.
- Token usage comes from `event.message.usage` on `turn_end` events. There are **multiple turns per prompt** (one per LLM call + tool execution round). You must **accumulate** usage across all turns, not just take the last one.
- `promptNumber` and `iteration` are harness-level concepts. They are NOT in Pi events. The `BenchmarkRunner` passes them into `sendPrompt()` so they can be stamped onto `ToolCallRecord`s.
- Provider name lookup: Phase 2 generates a `providerMap` (model name → derived provider name like `"llama-qwen35-122b-a10b"`). Use that derived name — NOT the YAML `provider` field (`"llama-server"`) — when calling `modelRegistry.find()`.

**Files:**
- Create: `harness/src/pi-session.ts`

**What to implement:**

```typescript
import {
  createAgentSession,
  AuthStorage,
  ModelRegistry,
  SessionManager,
  SettingsManager,
  DefaultResourceLoader,
} from "@mariozechner/pi-coding-agent";
import type { ModelConfig, ToolCallRecord } from "./types.js";

export class BenchmarkSession {
  constructor(options: {
    modelConfig: ModelConfig;
    projectDir: string;      // cwd for the Pi session — the generated React app lives here
    sessionDir: string;      // where to save session.jsonl
    bareAgentDir: string;    // empty dir containing ONLY models.json
    providerName: string;    // derived provider name from providerMap (e.g. "llama-qwen35-122b-a10b")
    promptTimeoutMs?: number; // per-prompt timeout, default 30 minutes
  })

  // Must be called once before sendPrompt(). Creates the Pi session.
  async init(): Promise<void>

  // Send a prompt and wait for the agent to finish all work.
  // Accumulates metrics across all turns triggered by this prompt.
  async sendPrompt(
    text: string,
    promptNumber: number,  // 1–5, which benchmark prompt
    iteration: number      // 1-indexed, which repair iteration
  ): Promise<{
    inputTokens: number;
    outputTokens: number;
    timeMs: number;           // wall clock for this sendPrompt() call
    generationTimeMs: number; // LLM generation time only (excludes tool execution wait time)
    toolCalls: ToolCallRecord[];
    completed: boolean;       // false if agent errored or timed out
    error?: string;
  }>

  // Absolute path to the session.jsonl file
  get sessionFile(): string;

  // Dispose the session (flushes session.jsonl, cleans up)
  async dispose(): Promise<void>;
}
```

### Implementation details

**`init()` — Creating the Pi session:**

```typescript
// 1. Auth storage (local models don't need real auth — just needs to exist)
const authStorage = AuthStorage.create();

// 2. Model registry — loads our generated models.json from bareAgentDir
const modelRegistry = ModelRegistry.create(authStorage, path.join(bareAgentDir, "models.json"));

// 3. Find the model using the DERIVED provider name (not the YAML provider field)
const model = modelRegistry.find(providerName, modelConfig.modelId);
if (!model) throw new Error(`Model not found: ${providerName}/${modelConfig.modelId}`);

// 4. Bare resource loader — points at the empty bareAgentDir
//    DefaultResourceLoader finds: no skills, no extensions, no prompts, no AGENTS.md
const settingsManager = SettingsManager.inMemory({
  compaction: { enabled: true },
  retry: { enabled: true, maxRetries: 3 },
});
const loader = new DefaultResourceLoader({
  cwd: projectDir,
  agentDir: bareAgentDir,
  settingsManager,
});
await loader.reload();

// 5. Create the session
const { session } = await createAgentSession({
  cwd: projectDir,
  agentDir: bareAgentDir,
  model,
  thinkingLevel: "off",
  authStorage,
  modelRegistry,
  resourceLoader: loader,
  sessionManager: SessionManager.create(path.join(sessionDir, "session.jsonl")),
  settingsManager,
});
```

**`sendPrompt()` — Event subscription and metric collection:**

Before calling `session.prompt(text)`, subscribe to events to accumulate metrics:

```typescript
// Pending tool calls keyed by toolCallId
const pendingTools = new Map<string, { toolName: string; startMs: number }>();
const toolCalls: ToolCallRecord[] = [];
let inputTokens = 0;
let outputTokens = 0;
let generationTimeMs = 0;
let turnStartMs = 0;
let completed = false;
let error: string | undefined;

// Track generation time: from turn_start to message_end (assistant message only)
// This excludes time spent waiting for tool execution results
session.subscribe((event) => {
  switch (event.type) {
    case "turn_start":
      turnStartMs = Date.now();
      break;

    case "message_end":
      // Only count time for assistant messages, not tool result messages
      if (event.message.role === "assistant") {
        generationTimeMs += Date.now() - turnStartMs;
      }
      break;

    case "turn_end":
      // Accumulate token usage across ALL turns (there can be many per prompt)
      if (event.message.role === "assistant") {
        const usage = (event.message as any).usage;
        if (usage) {
          inputTokens += usage.input ?? 0;
          outputTokens += usage.output ?? 0;
        }
      }
      break;

    case "tool_execution_start":
      pendingTools.set(event.toolCallId, {
        toolName: event.toolName,
        startMs: Date.now(),
      });
      break;

    case "tool_execution_end": {
      const pending = pendingTools.get(event.toolCallId);
      if (pending) {
        pendingTools.delete(event.toolCallId);
        toolCalls.push({
          toolName: pending.toolName,
          promptNumber,
          iteration,
          durationMs: Date.now() - pending.startMs,
          args: sanitizeArgs(event.args),
        });
      }
      break;
    }

    case "agent_end":
      completed = true;
      break;
  }
});
```

Then call `session.prompt(text)` wrapped in a timeout:

```typescript
const startMs = Date.now();
const timeoutMs = options.promptTimeoutMs ?? 30 * 60 * 1000; // 30 minutes default

await Promise.race([
  session.prompt(text),
  new Promise<void>((_, reject) =>
    setTimeout(() => reject(new Error("Prompt timed out")), timeoutMs)
  ),
]);

return {
  inputTokens,
  outputTokens,
  timeMs: Date.now() - startMs,
  generationTimeMs,
  toolCalls,
  completed,
  error,
};
```

Wrap the whole thing in try/catch — if `session.prompt()` throws, return `completed: false` with the error message.

**`sanitizeArgs(args)` helper:**
Return a copy of args with values truncated to 200 chars for storage. This prevents tool call records from bloating with file contents.

**`dispose()`:**
Call `session.dispose()` if it exists, or `session.close()`. If neither exists, just log that the session is done — the session manager will have already flushed to disk.

**Steps:**
- [ ] Implement `BenchmarkSession` in `harness/src/pi-session.ts`
- [ ] Verify TypeScript compiles: `npx tsc --noEmit` from inside `harness/`
- [ ] Manual smoke test (if llama-server is available): create a session, send `"say hello in one sentence"`, log the result — verify inputTokens > 0, outputTokens > 0, completed = true
- [ ] Commit with message: `"phase3: Pi SDK session wrapper with metrics collection"`

**Acceptance criteria:**
- [ ] `BenchmarkSession` creates a Pi session with bare config (no skills, extensions, context files)
- [ ] `sendPrompt()` returns inputTokens, outputTokens, timeMs, generationTimeMs, toolCalls, completed
- [ ] Token usage is **accumulated across all turns** (not just the last turn)
- [ ] `promptNumber` and `iteration` are stamped onto each `ToolCallRecord`
- [ ] `generationTimeMs` excludes tool execution wait time (only LLM generation time)
- [ ] Timeout returns `completed: false` with error message instead of hanging
- [ ] Errors from `session.prompt()` are caught and returned as `completed: false`
- [ ] Session file is saved to `sessionDir/session.jsonl`
- [ ] TypeScript compiles without errors
