# Phase 6: Main Benchmark Runner

**Depends on:** [Phase 2](phase-2-config.md), [Phase 3](phase-3-pi-session.md), [Phase 4](phase-4-validator.md), [Phase 5](phase-5-feedback.md)
**Next phase:** [Phase 7 — Reviewer](phase-7-reviewer.md), [Phase 8 — Scoring & Reporting](phase-8-scoring-reporting.md)

---

## Task 6.1: Implement the orchestrator

**Context:**
This is the main loop that ties everything together. For each model × run, it: creates a fresh project directory, creates a Pi session (Phase 3), sends each of the 5 benchmark prompts, validates the output (Phase 4), sends symptom-based feedback if validation fails (Phase 5), and repeats up to `maxIterationsPerPrompt` times. It tracks all metrics and saves them to `metrics.json`.

The runner implements v1's policies:
- **Continue-on-failure:** If prompt N fails, still attempt prompt N+1. The model works on whatever broken state it left behind.
- **Stuck detection:** If the last `stuckThreshold` feedback messages have identical error strings, the model is looping — stop that prompt early.
- **Model swap pause:** Since all local models use the same llama-server, pause between models and wait for the user to confirm they've swapped the model.
- **Resume capability:** If `metrics.json` already exists for a run, skip it — allows resuming after crashes.

**Files:**
- Create: `harness/src/runner.ts`

**What to implement:**

```typescript
import { mkdirSync, existsSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";
import * as readline from "readline";
import type { ModelConfig, BenchmarkSettings, RunMetrics, PromptResult } from "./types.js";
import { BenchmarkSession } from "./pi-session.js";
import { validateProject } from "./validator.js";
import { composeFeedback } from "./feedback.js";
import { writeModelsJson } from "./models-json.js";
import { generateStatusMd } from "./reviewer.js";

export class BenchmarkRunner {
  constructor(
    private models: ModelConfig[],
    private settings: BenchmarkSettings,
    private prompts: string[],           // Array of 5 prompt strings from loadPrompts()
    private providerMap: Map<string, string>, // model.name → derived provider name
    private bareAgentDir: string         // Absolute path to harness/.bare-agent/
  )

  // Run full benchmark for all models × all runs (sequential).
  async runAll(): Promise<void>

  // Run all runs for a single model.
  async runModel(model: ModelConfig): Promise<void>

  // Run one benchmark session: one model, one run number.
  // Returns the collected RunMetrics.
  async runSingle(model: ModelConfig, runNumber: number): Promise<RunMetrics>
}
```

### `runAll()` implementation

```typescript
for (let i = 0; i < this.models.length; i++) {
  const model = this.models[i];

  // Model swap pause: prompt user to confirm llama-server is serving this model.
  // Skip if this is the first model.
  if (i > 0) {
    const prev = this.models[i - 1];
    // Only pause if same baseUrl (same server, needs model swap)
    if (prev.baseUrl === model.baseUrl) {
      await this.waitForModelSwap(model);
    }
  }

  await this.runModel(model);
}
```

### `waitForModelSwap(model)` helper

```typescript
private async waitForModelSwap(model: ModelConfig): Promise<void> {
  console.log(`\n${"=".repeat(70)}`);
  console.log(`Ready for model: ${model.name}`);
  console.log(`Ensure llama-server is serving this model at: ${model.baseUrl}`);
  console.log(`${"=".repeat(70)}`);
  console.log("Press Enter when ready...");

  const rl = readline.createInterface({ input: process.stdin });
  await new Promise<void>((resolve) => rl.once("line", () => { rl.close(); resolve(); }));
}
```

### `runModel()` implementation

```typescript
for (let run = 1; run <= this.settings.runsPerModel; run++) {
  const metricsPath = join(this.settings.outputDir, model.name, `run-${run}`, "metrics.json");
  if (existsSync(metricsPath)) {
    console.log(`[${model.name} / run ${run}] Skipping: already completed`);
    continue;
  }
  await this.runSingle(model, run);
}
```

### `runSingle()` implementation (the core logic)

```typescript
async runSingle(model: ModelConfig, runNumber: number): Promise<RunMetrics> {
  const runDir = join(this.settings.outputDir, model.name, `run-${runNumber}`);
  const projectDir = join(runDir, "project");
  const validationDir = join(runDir, "validation");

  // 1. Create output directories
  mkdirSync(projectDir, { recursive: true });
  mkdirSync(validationDir, { recursive: true });

  // 2. Write models.json for this model to bareAgentDir
  writeModelsJson([model], join(this.bareAgentDir, "models.json"));
  const providerName = this.providerMap.get(model.name)!;

  // 3. Create Pi session
  const session = new BenchmarkSession({
    modelConfig: model,
    projectDir,
    sessionDir: runDir,
    bareAgentDir: this.bareAgentDir,
    providerName,
    promptTimeoutMs: 30 * 60 * 1000, // 30 minutes
  });
  await session.init();

  const startedAt = new Date().toISOString();
  const promptResults: PromptResult[] = [];
  let totalGenerationMs = 0;

  // 4. For each of the 5 prompts
  for (let promptNum = 1; promptNum <= this.prompts.length; promptNum++) {
    const prompt = this.prompts[promptNum - 1];
    console.log(`[${model.name} / run ${runNumber} / prompt ${promptNum}] Starting...`);

    const result = await this.runPrompt(
      session, prompt, promptNum, projectDir, validationDir, model.name, runNumber
    );

    promptResults.push(result);
    totalGenerationMs += result.toolCalls.reduce((sum, tc) => sum, 0); // placeholder
    // (actual generation time tracked in session)

    const status = result.completed ? "✓ passed" : `✗ failed (${result.failureReason})`;
    console.log(`[${model.name} / run ${runNumber} / prompt ${promptNum}] ${status} — ${result.iterations} iteration(s)`);
  }

  // 5. Calculate aggregates
  const completedAt = new Date().toISOString();
  const completedTasks = promptResults.filter((p) => p.completed).length;
  const totalIterations = promptResults.reduce((sum, p) => sum + p.iterations, 0);
  const totalInputTokens = promptResults.reduce((sum, p) => sum + p.inputTokens, 0);
  const totalOutputTokens = promptResults.reduce((sum, p) => sum + p.outputTokens, 0);
  const totalTimeMs = promptResults.reduce((sum, p) => sum + p.timeMs, 0);

  // meanDecodeTps: estimate from generation-only time tracked in session
  // For now, store 0 — runner will be updated when session exposes this
  const meanDecodeTps = 0;
  const generationTimeMinutes = meanDecodeTps > 0
    ? totalOutputTokens / meanDecodeTps / 60
    : 0;

  const metrics: RunMetrics = {
    model: model.name,
    runNumber,
    startedAt,
    completedAt,
    prompts: promptResults,
    completedTasks,
    totalIterations,
    totalInputTokens,
    totalOutputTokens,
    totalTimeMs,
    generationTimeMinutes,
    meanDecodeTps,
    sessionFile: session.sessionFile,
  };

  // 6. Save metrics.json
  writeFileSync(join(runDir, "metrics.json"), JSON.stringify(metrics, null, 2));

  // 7. Generate status.md in the project directory (used by the review phase)
  writeFileSync(join(projectDir, "status.md"), generateStatusMd(metrics));

  // 8. Dispose session
  await session.dispose();

  console.log(`[${model.name} / run ${runNumber}] Completed. Tasks: ${completedTasks}/5, Iterations: ${totalIterations}`);
  return metrics;
}
```

### `runPrompt()` helper (the per-prompt loop)

```typescript
private async runPrompt(
  session: BenchmarkSession,
  prompt: string,
  promptNum: number,
  projectDir: string,
  validationDir: string,
  modelName: string,
  runNumber: number
): Promise<PromptResult> {
  const maxIter = this.settings.maxIterationsPerPrompt;
  const stuckThreshold = this.settings.stuckThreshold;

  let inputTokens = 0;
  let outputTokens = 0;
  let timeMs = 0;
  const allToolCalls = [];
  const allValidations = [];
  const recentErrors: string[] = []; // sliding window for stuck detection

  // Send the initial prompt (iteration 1)
  let currentText = prompt;
  let completed = false;
  let failureReason: string | undefined;

  for (let iter = 1; iter <= maxIter; iter++) {
    console.log(`[${modelName} / run ${runNumber} / prompt ${promptNum} / iter ${iter}] Sending to model...`);

    const result = await session.sendPrompt(currentText, promptNum, iter);
    inputTokens += result.inputTokens;
    outputTokens += result.outputTokens;
    timeMs += result.timeMs;
    allToolCalls.push(...result.toolCalls);

    if (!result.completed) {
      failureReason = result.error ?? "Model error";
      break;
    }

    // Validate
    const screenshotDir = join(validationDir, `prompt-${promptNum}-iter-${iter}`);
    mkdirSync(screenshotDir, { recursive: true });

    console.log(`[${modelName} / run ${runNumber} / prompt ${promptNum} / iter ${iter}] Validating...`);
    const validations = await validateProject(projectDir, promptNum, screenshotDir, this.settings.validation);
    allValidations.push(...validations);

    // Check if all passed
    const allPassed = validations.every((v) => v.passed);
    if (allPassed) {
      completed = true;
      break;
    }

    // Compose feedback
    const feedback = composeFeedback(validations, promptNum);
    if (!feedback) {
      // composeFeedback returned null even though not all passed — shouldn't happen
      completed = true;
      break;
    }

    console.log(`[${modelName} / run ${runNumber} / prompt ${promptNum} / iter ${iter}] Validation failed. Sending feedback.`);

    // Stuck detection: check if the last N error strings are identical
    recentErrors.push(feedback);
    if (recentErrors.length > stuckThreshold) recentErrors.shift();

    if (
      recentErrors.length === stuckThreshold &&
      recentErrors.every((e) => e === recentErrors[0])
    ) {
      failureReason = "stuck on repeated error";
      console.log(`[${modelName} / run ${runNumber} / prompt ${promptNum}] Stuck detected — stopping early`);
      break;
    }

    // Send feedback as next prompt (unless this was the last iteration)
    if (iter < maxIter) {
      currentText = feedback;
    } else {
      failureReason = "max iterations reached";
    }
  }

  return {
    promptNumber: promptNum,
    completed,
    iterations: allToolCalls.length > 0
      ? Math.max(1, allValidations.length)
      : 1,
    failureReason,
    inputTokens,
    outputTokens,
    timeMs,
    toolCalls: allToolCalls,
    validationResults: allValidations,
  };
}
```

**Note on `iterations` count:** Count the number of validation attempts (one per send-then-validate cycle). The first successful prompt with no repairs = 1 iteration.

**Steps:**
- [ ] Implement `BenchmarkRunner` in `harness/src/runner.ts`
- [ ] Verify `npx tsc --noEmit` passes from inside `harness/`
- [ ] Manual test: run with a single model, `runsPerModel: 1` — observe the full 5-prompt loop, confirm directory structure is created, `metrics.json` is saved, `status.md` is written to `project/`
- [ ] Verify resume: run again — confirm the completed run is skipped with "already completed" log
- [ ] Verify stuck detection: mock a validator that always returns the same error — confirm it stops after `stuckThreshold` identical feedbacks
- [ ] Commit with message: `"phase6: main benchmark runner with validation loop and stuck detection"`

**Acceptance criteria:**
- [ ] Full 5-prompt loop executes for a single model
- [ ] Validation happens after each prompt send
- [ ] Feedback loop works (up to `maxIterationsPerPrompt`)
- [ ] Stuck detection stops early on `stuckThreshold` identical feedbacks
- [ ] `metrics.json` is saved with all fields populated
- [ ] `status.md` is written to `project/` by the runner (not the reviewer)
- [ ] Continue-on-failure: next prompt is attempted even if current one failed
- [ ] Resume capability skips runs where `metrics.json` already exists
- [ ] Model swap pause prompts user via stdin between models with the same `baseUrl`
- [ ] TypeScript compiles without errors
