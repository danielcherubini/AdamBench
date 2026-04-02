# AdamBench v2 Automation Plan

**Goal:** Automate the entire AdamBench pipeline — benchmark execution via Pi SDK against local llama-server models, automated build + browser validation with symptom-based error feedback, multi-run support, and automated reviewer scoring via API models.

**Architecture:** A TypeScript Node.js harness (`harness/`) in this repo that orchestrates Pi coding agent sessions via SDK, validates outputs with `npm run build` + Playwright headless browser checks, feeds symptom-only errors back to the model automatically (matching v1 manual policy), collects all v1 metrics (tokens, iterations, time, TPS), then runs the review phase programmatically via API reviewer models.

**Tech Stack:** TypeScript (tsx), `@mariozechner/pi-coding-agent` SDK, Playwright (headless Chromium), `commander` (CLI), `yaml` (config parsing)

---

## Directory Structure (final state)

```
AdamBench/
├── harness/                        # NEW — automation harness
│   ├── package.json
│   ├── tsconfig.json
│   ├── playwright.config.ts
│   └── src/
│       ├── index.ts                # CLI entry point (commander)
│       ├── types.ts                # All shared TypeScript types
│       ├── config.ts               # Load & validate YAML configs
│       ├── models-json.ts          # Generate Pi models.json from config
│       ├── pi-session.ts           # Pi SDK wrapper for benchmark sessions
│       ├── validator.ts            # Build + Playwright browser checks
│       ├── feedback.ts             # Error → symptom-description translator
│       ├── runner.ts               # Main benchmark orchestrator
│       ├── reviewer.ts             # Automated review via API models
│       ├── metrics.ts              # Scoring formulas (Scored, Measured, AdamBench)
│       └── reporter.ts             # Aggregate results → CSV/JSON
├── config/                         # NEW — benchmark configuration
│   ├── models.yaml                 # Model definitions with compat overrides
│   └── settings.yaml               # Benchmark settings (runs, timeouts, etc.)
├── runs/                           # NEW — v2 automated run outputs
│   └── <model-name>/
│       └── run-<N>/
│           ├── project/            # The generated React app
│           ├── session.jsonl       # Pi session log
│           ├── metrics.json        # Per-run metrics
│           └── validation/         # Build logs, screenshots, console logs
├── review_outputs_v2/              # NEW — automated reviewer outputs
│   └── <reviewer-model>/
│       └── <model-name>_run<N>.md
├── results/                        # NEW — aggregated scoring
│   ├── summary.csv
│   ├── summary.json
│   └── per-model/
│       └── <model-name>.json
├── prompts/                        # EXISTING — unchanged
├── projects/                       # EXISTING — v1 projects, unchanged
├── review_outputs/                 # EXISTING — v1 reviews, unchanged
└── visualisations/                 # EXISTING — unchanged
```

---

## Phase 1: Project Scaffolding & Types

### Task 1.1: Initialize harness project

**Context:**
The AdamBench repo has no root-level Node.js project. We need a `harness/` directory with its own `package.json`, `tsconfig.json`, and dependencies. This is a standalone sub-project — it does NOT interfere with the existing `projects/` directories.

**Files:**

- Create: `harness/package.json`
- Create: `harness/tsconfig.json`

**What to implement:**

`harness/package.json`:

- `"name": "adambench-harness"`
- `"type": "module"` (ESM)
- `"private": true`
- Dependencies:
  - `@mariozechner/pi-coding-agent` (version 0.64.0) (Pi SDK)
  - `@mariozechner/pi-ai` (version 0.64.0) (for `getModel` and types)
  - `playwright` (browser validation)
  - `commander` (CLI framework)
  - `yaml` (config parsing)
- Dev dependencies:
  - `typescript`
  - `tsx` (TypeScript runner)
  - `@types/node`
- Scripts:
  - `"start": "tsx src/index.ts"`
  - `"benchmark": "tsx src/index.ts benchmark"`
  - `"review": "tsx src/index.ts review"`
  - `"score": "tsx src/index.ts score"`

`harness/tsconfig.json`:

- `target: "ES2022"`, `module: "ESNext"`, `moduleResolution: "bundler"`
- `strict: true`, `outDir: "dist"`, `rootDir: "src"`

**Steps:**

- [ ] Create `harness/package.json` with the above structure
- [ ] Create `harness/tsconfig.json`
- [ ] Run `npm install` in `harness/`
- [ ] Run `npx playwright install chromium` in `harness/`
- [ ] Verify `npx tsx --version` works
- [ ] Commit with message: "phase1: scaffold harness project with dependencies"

**Acceptance criteria:**

- [ ] `npm install` completes without errors in `harness/`
- [ ] `npx tsx src/index.ts` runs (can just print "harness" and exit for now)

---

### Task 1.2: Define all shared types

**Context:**
Every other module depends on shared type definitions. These types mirror v1's data model (model config, run metrics, prompt results, validation results, review scores) and extend it for v2 (multi-run, per-prompt timing, tool call tracking). All types go in one file so every module imports from the same place.

**Files:**

- Create: `harness/src/types.ts`

**What to implement:**

```typescript
// ── Config types ──

export interface ModelConfig {
  name: string; // Human-readable name, e.g. "Qwen3.5-122b-A10b"
  provider: string; // Pi provider name, e.g. "llama-server"
  baseUrl: string; // e.g. "http://192.168.1.100:8080/v1"
  modelId: string; // Model ID sent to API, e.g. "local-model"
  apiKey: string; // API key (llama-server ignores this, use "not-needed")
  contextWindow: number; // e.g. 32768
  maxTokens?: number; // Default 16384
  reasoning?: boolean; // Default false
  compat?: Record<string, any>; // Pi compat overrides (supportsDeveloperRole, etc.)
}

export interface ReviewerConfig {
  name: string; // Human-readable name for output dirs
  provider: string; // e.g. "anthropic"
  modelId: string; // e.g. "claude-sonnet-4-6"
}

export interface BenchmarkSettings {
  runsPerModel: number; // Default 3
  maxIterationsPerPrompt: number; // Default 5
  stuckThreshold: number; // Same error N times → stop prompt. Default 3
  promptsDir: string; // Relative to repo root, default "../prompts"
  outputDir: string; // Relative to repo root, default "../runs"
  reviewOutputDir: string; // Default "../review_outputs_v2"
  resultsDir: string; // Default "../results"
  validation: ValidationSettings;
  reviewers: ReviewerConfig[];
}

export interface ValidationSettings {
  npmInstallTimeoutMs: number; // Default 120000
  buildTimeoutMs: number; // Default 120000
  devServerStartupMs: number; // Default 15000
  browserCheckTimeoutMs: number; // Default 30000
  screenshotOnFailure: boolean; // Default true
  screenshotOnSuccess: boolean; // Default false
}

// ── Runtime / metrics types ──

export interface ToolCallRecord {
  toolName: string; // "read", "write", "edit", "bash"
  promptNumber: number; // Which prompt this happened during
  iteration: number; // Which iteration of that prompt
  durationMs: number;
  args?: Record<string, any>; // Sanitized args (e.g. file path for read)
}

export interface ValidationResult {
  type: "build" | "runtime" | "browser";
  passed: boolean;
  errors: string[]; // Human-readable error descriptions
  screenshots?: string[]; // File paths to screenshots
  consoleErrors?: string[]; // Browser console error messages
  timestamp: number;
}

export interface PromptResult {
  promptNumber: number; // 1-5
  completed: boolean;
  iterations: number; // 1 = first-pass success, >1 = needed repair
  failureReason?: string; // Why it ultimately failed (if it did)
  inputTokens: number;
  outputTokens: number;
  timeMs: number; // Wall clock time for this prompt (all iterations)
  toolCalls: ToolCallRecord[];
  validationResults: ValidationResult[]; // One per iteration attempt
}

export interface RunMetrics {
  model: string; // Model name from config
  runNumber: number;
  startedAt: string; // ISO timestamp
  completedAt: string; // ISO timestamp
  prompts: PromptResult[];
  completedTasks: number; // 0-5
  totalIterations: number; // Sum across all prompts
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTimeMs: number; // Total wall clock
  generationTimeMinutes: number; // output_tokens / tps / 60 (for AdamBench formula)
  meanDecodeTps: number; // Estimated from timing
  sessionFile: string; // Path to session.jsonl
}

// ── Review types ──

export interface ReviewScores {
  taskCompletion: number; // 1-10
  correctness: number; // 1-10
  codeQuality: number; // 1-10
  architectureMaintainability: number; // 1-10
  simplicityVsOverengineering: number; // 1-10
  overallProjectQuality: number; // 1-10
  overallScore: number; // 1-100
  comment: string; // Reviewer summary comment
}

export interface ReviewResult {
  reviewer: string; // Reviewer model name
  model: string; // Benchmarked model name
  runNumber: number;
  scores: ReviewScores;
  rawMarkdown: string; // Full review output
}

// ── Aggregated scoring types ──

export interface ModelResults {
  model: string;
  runs: RunMetrics[];
  reviews: ReviewResult[];
  scored: number; // Average of reviewer overall scores
  measured: number; // Scored * completion multiplier - iteration penalty
  adamBench: number; // Measured - time penalty
  scoredStdDev: number; // Across runs
  adamBenchStdDev: number; // Across runs
}
```

**Steps:**

- [ ] Create `harness/src/types.ts` with all types above
- [ ] Verify it compiles: `npx tsc --noEmit` from `harness/`
- [ ] Commit with message: "phase1: define all shared types for harness"

**Acceptance criteria:**

- [ ] File compiles without errors
- [ ] Types cover all v1 metrics (completed tasks, iterations, TPS, input/output tokens, time) plus v2 additions (per-prompt breakdown, tool calls, multi-run stats)

