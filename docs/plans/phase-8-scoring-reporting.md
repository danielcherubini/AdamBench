# Phase 8: Scoring & Reporting

**Depends on:** [Phase 1](phase-1-scaffolding.md), [Phase 2](phase-2-config.md), [Phase 6](phase-6-runner.md), [Phase 7](phase-7-reviewer.md)
**Next phase:** [Phase 9 — Integration](phase-9-integration.md)

---

## Task 8.1: Implement scoring formulas

**Context:**
Calculate all v1 metrics (Scored, Measured, AdamBench) from the collected run metrics and review scores, plus new v2 cross-run statistics (averaging and standard deviation across multiple runs). The formulas must reproduce v1's published results exactly when given the same inputs — verify this against the known values in `README.md`.

**Files:**
- Create: `harness/src/metrics.ts`

**What to implement:**

```typescript
import type { RunMetrics, ReviewResult, ModelResults } from "./types.js";

// v1 formula: average of reviewer overall scores, rounded to 2 decimal places.
// reviewerOverallScores: array of the 'overallScore' (1–100) field from each reviewer.
export function calculateScored(reviewerOverallScores: number[]): number

// v1 formula: quality score adjusted for completion and iterations.
// completedTasks: 0–5
// totalIterations: total repair iterations across all 5 prompts
export function calculateMeasured(
  scored: number,
  completedTasks: number,
  totalIterations: number
): number

// v1 formula: measured score adjusted for generation time.
// generationTimeMinutes: output_tokens / meanDecodeTps / 60
export function calculateAdamBench(
  measured: number,
  generationTimeMinutes: number
): number

// Aggregate results across multiple runs for one model.
// For each run, calculate Scored/Measured/AdamBench, then average + stddev across runs.
export function aggregateModelResults(
  modelName: string,
  runs: RunMetrics[],
  reviews: ReviewResult[]
): ModelResults
```

**Formula implementations (must match v1 exactly):**

```typescript
function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function calculateScored(reviewerOverallScores: number[]): number {
  // Scored = round((r1 + r2 + ... + rN) / N, 2)
  if (reviewerOverallScores.length === 0) return 0;
  const avg = reviewerOverallScores.reduce((a, b) => a + b, 0) / reviewerOverallScores.length;
  return round(avg, 2);
}

export function calculateMeasured(
  scored: number,
  completedTasks: number,
  totalIterations: number
): number {
  // Completion multiplier m(T):
  // T=0 → 0, T=1 → 0.2, T=2 → 0.4, T=3 → 0.65, T=4 → 0.85, T=5 → 1.0
  const multipliers = [0, 0.2, 0.4, 0.65, 0.85, 1.0];
  const m = multipliers[Math.min(completedTasks, 5)] ?? 0;
  const penalty = 0.35 * Math.pow(Math.max(0, totalIterations - 5), 1.25);
  return round(Math.max(0, scored * m - penalty), 2);
}

export function calculateAdamBench(
  measured: number,
  generationTimeMinutes: number
): number {
  // AdamBench = round(max(0, M - 3 * max(0.15, 1 - M/100) * ln(1 + t)), 2)
  const timePenalty = 3 * Math.max(0.15, 1 - measured / 100) * Math.log(1 + generationTimeMinutes);
  return round(Math.max(0, measured - timePenalty), 2);
}
```

**`aggregateModelResults` implementation:**

For each run:
1. Find all reviews for this run: `reviews.filter(r => r.model === modelName && r.runNumber === run.runNumber)`
2. Calculate `scored` from the reviewer `overallScore` values
3. Calculate `measured` from `scored`, `run.completedTasks`, `run.totalIterations`
4. Calculate `adamBench` from `measured`, `run.generationTimeMinutes`

Then average and compute stddev across all runs:
```typescript
function stddev(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
  return round(Math.sqrt(variance), 2);
}
```

**Verification against v1:**
Use these known values from `README.md` to check your formulas:
- `Qwen3.5-122b-A10b`: Scored=77.33, completedTasks=5, totalIterations=5, generationTimeMinutes=29 → Measured should be 77.33 (no iteration penalty since iterations=5), AdamBench=75.02
- `gpt-oss-120b`: Scored=76, completedTasks=5, totalIterations=6, generationTimeMinutes=11 → AdamBench=73.83

**Steps:**
- [ ] Implement all functions in `harness/src/metrics.ts`
- [ ] Verify formulas against v1 data from `README.md` — Qwen3.5-122b should give AdamBench≈75.02
- [ ] Verify edge cases: 0 completed tasks → Measured=0, 0 iterations with 5 completed tasks → no penalty
- [ ] Implement `aggregateModelResults` with stddev
- [ ] Verify `npx tsc --noEmit` passes from inside `harness/`
- [ ] Commit with message: `"phase8: scoring formulas matching v1 plus multi-run aggregation"`

**Acceptance criteria:**
- [ ] `calculateScored` matches v1: round(average of overallScores, 2)
- [ ] `calculateMeasured` matches v1 completion multipliers and penalty formula exactly
- [ ] `calculateAdamBench` matches v1 formula exactly
- [ ] Known v1 values reproduced within ±0.01 rounding tolerance
- [ ] `aggregateModelResults` averages scores across runs and computes stddev
- [ ] Edge cases handled: 0 completed tasks, 0 reviews, 0 iterations
- [ ] TypeScript compiles without errors

---

## Task 8.2: Implement reporter and CLI

**Context:**
The reporter aggregates all run metrics and review scores into final output files (CSV and JSON). The CLI entry point ties all phases together with `commander` subcommands. The CLI is the single entry point for everything: running benchmarks, running reviews, calculating scores, generating reports, and checking status.

**Files:**
- Create: `harness/src/reporter.ts`
- Modify: `harness/src/index.ts` (replace the stub from Task 1.1 with the full CLI)

**What to implement:**

### `harness/src/reporter.ts`

```typescript
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import type { ModelResults } from "./types.js";

export class Reporter {
  // Generate summary.csv in v1 format + multi-run columns
  generateCsv(results: ModelResults[], outputPath: string): void

  // Generate full JSON results
  generateJson(results: ModelResults[], outputPath: string): void

  // Generate per-model detailed JSON files to outputDir/per-model/<model-name>.json
  generatePerModelJson(results: ModelResults[], outputDir: string): void
}
```

**CSV format** (extends v1, handles missing TPS/Time gracefully with empty string):
```
Model,AdamBench,AdamBench_StdDev,Scored,Scored_StdDev,Completed,Iterations,TPS,Input_tokens,Output_tokens,Time_min,Runs
Qwen3.5-122b,75.02,2.1,77.33,1.5,5,5,24,2700000,42000,29,3
gpt-oss-120b,73.83,1.8,76.0,1.2,5,6,30,855000,19000,11,3
```

For `Completed` and `Iterations`: use the average across runs (rounded to 1 decimal).
For `TPS` and `Time_min`: use the average across runs, or empty string if `meanDecodeTps === 0`.

### `harness/src/index.ts` — Full CLI

```typescript
import { Command } from "commander";
import path from "path";
import { loadModelsConfig, loadSettings, loadPrompts } from "./config.js";
import { writeModelsJson } from "./models-json.js";
import { BenchmarkRunner } from "./runner.js";
import { AutomatedReviewer } from "./reviewer.js";
import { aggregateModelResults } from "./metrics.js";
import { Reporter } from "./reporter.js";

const program = new Command();
const REPO_ROOT = path.resolve(import.meta.dirname, "../..");
const BARE_AGENT_DIR = path.resolve(import.meta.dirname, "../.bare-agent");
const CONFIG_MODELS = path.join(REPO_ROOT, "config", "models.yaml");
const CONFIG_SETTINGS = path.join(REPO_ROOT, "config", "settings.yaml");

program
  .name("adambench")
  .description("AdamBench v2 automation harness");

// benchmark command
program
  .command("benchmark")
  .description("Run benchmark for all models (or a specific model/run)")
  .option("--model <name>", "Only benchmark this model (exact name from models.yaml)")
  .option("--run <n>", "Only run this run number", parseInt)
  .option("--dry-run", "Validate config and print plan without running any sessions")
  .action(async (opts) => {
    const allModels = loadModelsConfig(CONFIG_MODELS);
    const settings = loadSettings(CONFIG_SETTINGS, REPO_ROOT);
    const prompts = loadPrompts(settings.promptsDir);
    const providerMap = writeModelsJson(allModels, path.join(BARE_AGENT_DIR, "models.json"));

    const models = opts.model ? allModels.filter((m) => m.name === opts.model) : allModels;
    if (models.length === 0) {
      console.error(`No model found with name: ${opts.model}`);
      process.exit(1);
    }

    if (opts.dryRun) {
      console.log("=== DRY RUN ===");
      console.log(`Models to benchmark: ${models.map((m) => m.name).join(", ")}`);
      console.log(`Runs per model: ${settings.runsPerModel}`);
      console.log(`Prompts dir: ${settings.promptsDir}`);
      console.log(`Output dir: ${settings.outputDir}`);
      console.log("models.json written to:", path.join(BARE_AGENT_DIR, "models.json"));
      return;
    }

    const runner = new BenchmarkRunner(models, settings, prompts, providerMap, BARE_AGENT_DIR);

    if (opts.model && opts.run) {
      await runner.runSingle(models[0], opts.run);
    } else if (opts.model) {
      await runner.runModel(models[0]);
    } else {
      await runner.runAll();
    }
  });

// review command
program
  .command("review")
  .description("Run automated review on completed benchmark runs")
  .option("--model <name>", "Only review this model")
  .action(async (opts) => {
    const settings = loadSettings(CONFIG_SETTINGS, REPO_ROOT);
    // Load all existing metrics.json files
    const runResults = loadAllRunMetrics(settings.outputDir, opts.model);
    const reviewer = new AutomatedReviewer(settings.reviewers, settings, BARE_AGENT_DIR, REPO_ROOT);
    await reviewer.reviewAll(runResults);
  });

// score command
program
  .command("score")
  .description("Calculate scores from existing metrics and reviews (no LLM calls)")
  .action(async () => {
    const settings = loadSettings(CONFIG_SETTINGS, REPO_ROOT);
    const runResults = loadAllRunMetrics(settings.outputDir);
    const reviews = loadAllReviews(settings.reviewOutputDir);
    const reporter = new Reporter();
    const results = [];
    for (const [modelName, runs] of runResults) {
      const modelReviews = reviews.filter((r) => r.model === modelName);
      results.push(aggregateModelResults(modelName, runs, modelReviews));
    }
    mkdirSync(settings.resultsDir, { recursive: true });
    reporter.generateJson(results, path.join(settings.resultsDir, "scores.json"));
    console.log(`Scores saved to ${path.join(settings.resultsDir, "scores.json")}`);
  });

// report command
program
  .command("report")
  .description("Generate summary CSV/JSON from scored results (no LLM calls)")
  .action(async () => {
    const settings = loadSettings(CONFIG_SETTINGS, REPO_ROOT);
    const scoresPath = path.join(settings.resultsDir, "scores.json");
    const results = JSON.parse(readFileSync(scoresPath, "utf8"));
    const reporter = new Reporter();
    reporter.generateCsv(results, path.join(settings.resultsDir, "summary.csv"));
    reporter.generateJson(results, path.join(settings.resultsDir, "summary.json"));
    reporter.generatePerModelJson(results, settings.resultsDir);
    console.log(`Report saved to ${settings.resultsDir}`);
  });

// status command
program
  .command("status")
  .description("Show which models have been run, how many runs, reviewed or not")
  .action(async () => {
    const settings = loadSettings(CONFIG_SETTINGS, REPO_ROOT);
    const allModels = loadModelsConfig(CONFIG_MODELS);
    // For each model, check how many runs exist and whether reviews exist
    for (const model of allModels) {
      const modelDir = path.join(settings.outputDir, model.name);
      // ... print status table
    }
  });

program.parse();
```

Also implement `loadAllRunMetrics(outputDir, modelFilter?)` and `loadAllReviews(reviewOutputDir)` as local helper functions in `index.ts` — they scan directories and load JSON/markdown files.

**Steps:**
- [ ] Implement `Reporter` in `harness/src/reporter.ts`
- [ ] Implement full CLI in `harness/src/index.ts`
- [ ] Test `score` and `report` commands with mock `ModelResults` data
- [ ] Test `status` command against empty `runs/` dir (should show "0 runs" for all models)
- [ ] Test `--dry-run` flag: run `benchmark --dry-run` and verify no sessions are created
- [ ] Verify CSV output format with a sample result
- [ ] Verify `npx tsc --noEmit` passes from inside `harness/`
- [ ] Commit with message: `"phase8: CLI entry point and results reporter"`

**Acceptance criteria:**
- [ ] All CLI subcommands available: `benchmark`, `review`, `score`, `report`, `status`
- [ ] `--model` filter works for `benchmark` and `review`
- [ ] `--dry-run` prints plan without making any LLM calls or creating sessions
- [ ] CSV format matches v1 with multi-run extension columns
- [ ] JSON output includes all detailed metrics per run
- [ ] `status` shows meaningful information about completed/pending runs
- [ ] Clear error messages for missing config or invalid model names
- [ ] TypeScript compiles without errors
