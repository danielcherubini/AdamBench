# Phase 1: Project Scaffolding & Types

**Depends on:** Nothing
**Next phase:** [Phase 2 — Config](phase-2-config.md)

---

## Task 1.1: Initialize harness project

**Context:**
The AdamBench repo has no root-level Node.js project. We need a `harness/` directory with its own `package.json`, `tsconfig.json`, and dependencies. This is a standalone sub-project — it does NOT interfere with the existing `projects/` directories which contain v1 benchmark outputs.

**Files:**
- Create: `harness/package.json`
- Create: `harness/tsconfig.json`

**What to implement:**

`harness/package.json`:
```json
{
  "name": "adambench-harness",
  "type": "module",
  "private": true,
  "scripts": {
    "start": "tsx src/index.ts",
    "benchmark": "tsx src/index.ts benchmark",
    "review": "tsx src/index.ts review",
    "score": "tsx src/index.ts score"
  },
  "dependencies": {
    "@mariozechner/pi-coding-agent": "latest",
    "@mariozechner/pi-ai": "latest",
    "playwright": "latest",
    "commander": "latest",
    "yaml": "latest",
    "tree-kill": "latest"
  },
  "devDependencies": {
    "typescript": "latest",
    "tsx": "latest",
    "@types/node": "latest"
  }
}
```

`harness/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

**Steps:**
- [ ] Create `harness/package.json` with the above content
- [ ] Create `harness/tsconfig.json` with the above content
- [ ] Run `npm install` inside `harness/`
- [ ] Run `npx playwright install chromium` inside `harness/`
- [ ] Create a minimal `harness/src/index.ts` that prints `"adambench harness"` and exits (so the next step can verify it runs)
- [ ] Verify: run `npx tsx src/index.ts` from inside `harness/` — should print `"adambench harness"` with no errors
- [ ] Commit with message: `"phase1: scaffold harness project with dependencies"`

**Acceptance criteria:**
- [ ] `npm install` completes without errors in `harness/`
- [ ] `npx tsx src/index.ts` runs and exits cleanly from `harness/`
- [ ] `node_modules/@mariozechner/pi-coding-agent` exists

---

## Task 1.2: Define all shared types

**Context:**
Every other module in the harness depends on shared type definitions. These types mirror v1's data model (model config, run metrics, prompt results, validation results, review scores) and extend it for v2 (multi-run support, per-prompt timing, tool call tracking). All types go in a single file so every module imports from the same place. No logic — types only.

**Files:**
- Create: `harness/src/types.ts`

**What to implement:**

```typescript
// ── Config types ──

export interface ModelConfig {
  name: string;                    // Human-readable name, e.g. "Qwen3.5-122b-A10b"
  provider: string;                // Pi provider name in YAML, e.g. "llama-server"
  baseUrl: string;                 // e.g. "http://192.168.1.100:8080/v1"
  modelId: string;                 // Model ID sent to API, e.g. "local-model"
  apiKey: string;                  // API key (llama-server ignores this, use "not-needed")
  contextWindow: number;           // e.g. 32768
  maxTokens?: number;              // Default 16384
  reasoning?: boolean;             // Default false
  compat?: Record<string, any>;    // Pi compat overrides (supportsDeveloperRole, etc.)
}

export interface ReviewerConfig {
  name: string;                    // Human-readable name for output dirs, e.g. "Sonnet4.6"
  provider: string;                // e.g. "anthropic"
  modelId: string;                 // e.g. "claude-sonnet-4-6"
}

export interface BenchmarkSettings {
  runsPerModel: number;            // Default 3
  maxIterationsPerPrompt: number;  // Default 5
  stuckThreshold: number;          // Same error N times in a row → stop prompt. Default 3
  promptsDir: string;              // Absolute path to prompts directory
  outputDir: string;               // Absolute path to runs output directory
  reviewOutputDir: string;         // Absolute path to review_outputs_v2 directory
  resultsDir: string;              // Absolute path to results directory
  validation: ValidationSettings;
  reviewers: ReviewerConfig[];
}

export interface ValidationSettings {
  npmInstallTimeoutMs: number;     // Default 120000
  buildTimeoutMs: number;          // Default 120000
  devServerStartupMs: number;      // Default 15000
  browserCheckTimeoutMs: number;   // Default 30000
  screenshotOnFailure: boolean;    // Default true
  screenshotOnSuccess: boolean;    // Default false
}

// ── Runtime / metrics types ──

export interface ToolCallRecord {
  toolName: string;                // "read", "write", "edit", "bash"
  promptNumber: number;            // Which of the 5 prompts this happened during
  iteration: number;               // Which iteration of that prompt (1 = first attempt)
  durationMs: number;
  args?: Record<string, any>;      // Sanitized args (e.g. file path for read)
}

export interface ValidationResult {
  type: "build" | "runtime" | "browser";
  passed: boolean;
  errors: string[];                // Human-readable error descriptions
  screenshots?: string[];          // Absolute file paths to screenshots
  consoleErrors?: string[];        // Browser console error messages
  timestamp: number;               // Unix ms
}

export interface PromptResult {
  promptNumber: number;            // 1–5
  completed: boolean;              // true if validation passed after all iterations
  iterations: number;              // 1 = first-pass success, >1 = needed repair loops
  failureReason?: string;          // Why it ultimately failed (if completed=false)
  inputTokens: number;             // Total across all iterations for this prompt
  outputTokens: number;            // Total across all iterations for this prompt
  timeMs: number;                  // Wall clock time for this prompt (all iterations)
  toolCalls: ToolCallRecord[];     // All tool calls across all iterations
  validationResults: ValidationResult[];  // One entry per iteration attempt
}

export interface RunMetrics {
  model: string;                   // Model name from config
  runNumber: number;               // 1-indexed
  startedAt: string;               // ISO 8601 timestamp
  completedAt: string;             // ISO 8601 timestamp
  prompts: PromptResult[];         // One per prompt (1–5)
  completedTasks: number;          // 0–5, count of prompts where completed=true
  totalIterations: number;         // Sum of iterations across all prompts
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTimeMs: number;             // Total wall clock
  generationTimeMinutes: number;   // output_tokens / meanDecodeTps / 60
  meanDecodeTps: number;           // Estimated from generation-only timing
  sessionFile: string;             // Absolute path to session.jsonl
}

// ── Review types ──

export interface ReviewScores {
  taskCompletion: number;               // 1–10
  correctness: number;                  // 1–10
  codeQuality: number;                  // 1–10
  architectureMaintainability: number;  // 1–10
  simplicityVsOverengineering: number;  // 1–10
  overallProjectQuality: number;        // 1–10
  overallScore: number;                 // 1–100
  comment: string;                      // Reviewer summary from ## Summary section
}

export interface ReviewResult {
  reviewer: string;                // Reviewer model name (e.g. "Sonnet4.6")
  model: string;                   // Benchmarked model name
  runNumber: number;
  scores: ReviewScores;
  rawMarkdown: string;             // Full review output as-is
}

// ── Aggregated scoring types ──

export interface ModelResults {
  model: string;
  runs: RunMetrics[];
  reviews: ReviewResult[];
  scored: number;                  // Average of reviewer overall scores (1–100)
  measured: number;                // Scored * completion multiplier - iteration penalty
  adamBench: number;               // Measured - time penalty
  scoredStdDev: number;            // Standard deviation across runs
  adamBenchStdDev: number;         // Standard deviation across runs
}
```

**Steps:**
- [ ] Create `harness/src/types.ts` with all types above — no logic, types only
- [ ] Verify it compiles: run `npx tsc --noEmit` from inside `harness/`
- [ ] Commit with message: `"phase1: define all shared types for harness"`

**Acceptance criteria:**
- [ ] `harness/src/types.ts` compiles without errors
- [ ] All v1 metrics are represented (completedTasks, totalIterations, TPS, input/output tokens, time)
- [ ] All v2 additions are present (per-prompt breakdown, tool call records, multi-run stddev)
