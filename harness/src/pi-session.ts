import {
  createAgentSession,
  AuthStorage,
  ModelRegistry,
  SessionManager,
  SettingsManager,
  DefaultResourceLoader,
} from "@mariozechner/pi-coding-agent";
import * as path from "path";
import type { ModelConfig, ToolCallRecord } from "./types.js";

/**
 * Sanitizes tool call arguments to prevent bloating with file contents.
 */
function sanitizeArgs(args: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(args)) {
    if (typeof value === "string" && value.length > 200) {
      sanitized[key] = value.substring(0, 200) + "... (truncated)";
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export class BenchmarkSession {
  private session: any;
  private _sessionFile: string;
  private projectDir: string;
  private sessionDir: string;
  private bareAgentDir: string;
  private providerName: string;
  private promptTimeoutMs: number;

  constructor(options: {
    modelConfig: ModelConfig;
    projectDir: string;
    sessionDir: string;
    bareAgentDir: string;
    providerName: string;
    promptTimeoutMs?: number;
  }) {
    this.projectDir = options.projectDir;
    this.sessionDir = options.sessionDir;
    this.bareAgentDir = options.bareAgentDir;
    this.providerName = options.providerName;
    this.promptTimeoutMs = options.promptTimeoutMs ?? 30 * 60 * 1000; // 30 minutes default
    this._sessionFile = path.join(this.sessionDir, "session.jsonl");
  }

  /**
   * Creates the Pi session. Must be called once before sendPrompt().
   */
  async init(): Promise<void> {
    // 1. Auth storage (local models don't need real auth — just needs to exist)
    const authStorage = AuthStorage.create();

    // 2. Model registry — loads our generated models.json from bareAgentDir
    const modelRegistry = ModelRegistry.create(
      authStorage,
      path.join(this.bareAgentDir, "models.json")
    );

    // 3. Find the model using the DERIVED provider name (not the YAML provider field)
    const model = modelRegistry.find(this.providerName, "local-model");
    if (!model) {
      throw new Error(`Model not found: ${this.providerName}/local-model`);
    }

    // 4. Bare resource loader — points at the empty bareAgentDir
    //    DefaultResourceLoader finds: no skills, no extensions, no prompts, no AGENTS.md
    const settingsManager = SettingsManager.inMemory({
      compaction: { enabled: true },
      retry: { enabled: true, maxRetries: 3 },
    });
    const loader = new DefaultResourceLoader({
      cwd: this.projectDir,
      agentDir: this.bareAgentDir,
      settingsManager,
    });
    await loader.reload();

    // 5. Create the session
    const { session } = await createAgentSession({
      cwd: this.projectDir,
      agentDir: this.bareAgentDir,
      model,
      thinkingLevel: "off",
      authStorage,
      modelRegistry,
      resourceLoader: loader,
      sessionManager: SessionManager.create(this._sessionFile),
      settingsManager,
    });

    this.session = session;
  }

  /**
   * Send a prompt and wait for the agent to finish all work.
   * Accumulates metrics across all turns triggered by this prompt.
   */
  async sendPrompt(
    text: string,
    promptNumber: number, // 1–5, which benchmark prompt
    iteration: number // 1-indexed, which repair iteration
  ): Promise<{
    inputTokens: number;
    outputTokens: number;
    timeMs: number; // wall clock for this sendPrompt() call
    generationTimeMs: number; // LLM generation time only (excludes tool execution wait time)
    toolCalls: ToolCallRecord[];
    completed: boolean; // false if agent errored or timed out
    error?: string;
  }> {
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
    this.session.subscribe((event: any) => {
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

    const startMs = Date.now();
    const timeoutMs = this.promptTimeoutMs;

    try {
      await Promise.race([
        this.session.prompt(text),
        new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error("Prompt timed out")), timeoutMs)
        ),
      ]);
    } catch (e: any) {
      error = e.message;
      completed = false;
    }

    return {
      inputTokens,
      outputTokens,
      timeMs: Date.now() - startMs,
      generationTimeMs,
      toolCalls,
      completed,
      error,
    };
  }

  /**
   * Absolute path to the session.jsonl file
   */
  get sessionFile(): string {
    return this._sessionFile;
  }

  /**
   * Dispose the session (flushes session.jsonl, cleans up)
   */
  async dispose(): Promise<void> {
    if (this.session) {
      try {
        if ("dispose" in this.session) {
          await (this.session as any).dispose();
        } else if ("close" in this.session) {
          await (this.session as any).close();
        }
      } catch (e) {
        // Ignore errors during disposal
      }
    }
  }
}