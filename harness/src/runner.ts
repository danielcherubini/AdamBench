import * as fs from 'fs';
import * as path from 'path';
import { BenchmarkSession } from './pi-session.js';
import { composeFeedback } from './feedback.js';
import { validateProject } from './validator.js';
import { writeModelsJson, generateModelsJson } from './models-json.js';
import { generateStatusMd } from './reviewer.js';
import type {
  ModelConfig,
  BenchmarkSettings,
  ReviewerConfig,
  ValidationResult,
  PromptResult,
  RunMetrics,
  ToolCallRecord,
} from './types.js';

/**
 * BenchmarkRunner orchestrates the entire benchmarking process.
 * Runs all models sequentially with model swap pause.
 */
export class BenchmarkRunner {
  private models: ModelConfig[];
  private settings: BenchmarkSettings;
  private prompts: string[];
  private providerMap: Map<string, string>;
  private bareAgentDir: string;
  private resultsDir: string;
  private modelsJsonPath: string;

  constructor(
    models: ModelConfig[],
    settings: BenchmarkSettings,
    prompts: string[],
    providerMap: Map<string, string>,
    bareAgentDir: string,
    resultsDir: string
  ) {
    this.models = models;
    this.settings = settings;
    this.prompts = prompts;
    this.providerMap = providerMap;
    this.bareAgentDir = bareAgentDir;
    this.resultsDir = resultsDir;
    this.modelsJsonPath = path.join(bareAgentDir, "models.json");
  }

  /**
   * Runs all models sequentially with model swap pause between each model.
   */
  async runAll(): Promise<RunMetrics[]> {
    console.log("Starting benchmark for all models...");
    const allMetrics: RunMetrics[] = [];

    // Write models.json for each model
    for (const model of this.models) {
      const { providerMap } = generateModelsJson([model]);
      this.providerMap = providerMap;
    }

    for (let i = 0; i < this.models.length; i++) {
      const model = this.models[i];
      const runNumber = i + 1;

      console.log(`\n=== Running model ${runNumber}/${this.models.length}: ${model.name} ===`);
      console.log(`Pausing for ${this.settings.runsPerModel} runs per model...`);

      const metrics = await this.runModel(model, runNumber);
      allMetrics.push(metrics);

      // Model swap pause between models
      if (i < this.models.length - 1) {
        console.log(`\n${".".repeat(50)}`);
        console.log(`Model swap pause: switching from ${model.name} to ${this.models[i + 1].name}...`);
        console.log("=".repeat(50));
      }
    }

    return allMetrics;
  }

  /**
   * Runs all runs (iterations) for a single model.
   */
  async runModel(model: ModelConfig, runNumber: number): Promise<RunMetrics> {
    console.log(`\nStarting benchmark for model: ${model.name}`);

    // Check for resume capability
    if (this.settings.resume && this.checkMetricsExists(model.name, runNumber)) {
      console.log(`Resuming from checkpoint for model: ${model.name}`);
      return this.loadMetrics(model.name, runNumber);
    }

    const sessions: BenchmarkSession[] = [];
    const prompts: PromptResult[] = [];
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalIterations = 0;
    let completedTasks = 0;
    let totalTimeMs = 0;

    try {
      // Initialize session for this model
      const session = this.createSession(model);
      sessions.push(session);

      // Run each prompt
      for (let promptIndex = 0; promptIndex < this.prompts.length; promptIndex++) {
        const promptNumber = promptIndex + 1;
        const promptText = this.prompts[promptIndex];

        console.log(`\n--- Running prompt ${promptNumber}/${this.prompts.length} ---`);
        console.log(`Prompt text: ${promptText.substring(0, 100)}...`);

        const promptResult = await this.runPrompt(
          model,
          session,
          promptText,
          promptNumber,
          runNumber
        );

        prompts.push(promptResult);
        totalInputTokens += promptResult.inputTokens;
        totalOutputTokens += promptResult.outputTokens;
        totalIterations += promptResult.iterations;
        totalTimeMs += promptResult.timeMs;
        if (promptResult.completed) {
          completedTasks++;
        }
      }

      // Calculate generation time metrics
      const generationTimeMinutes = (totalOutputTokens / (totalTimeMs / 1000)).toFixed(2);
      const meanDecodeTps = totalTimeMs > 0 ? totalOutputTokens / (totalTimeMs / 1000) : 0;

      // Generate session file path
      const sessionFile = path.join(this.settings.outputDir, `${model.name.replace(/\s+/g, '_')}_${runNumber}.jsonl`);

      const metrics: RunMetrics = {
        model: model.name,
        runNumber,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        prompts,
        completedTasks,
        totalIterations,
        totalInputTokens,
        totalOutputTokens,
        totalTimeMs,
        generationTimeMinutes: parseFloat(generationTimeMinutes),
        meanDecodeTps,
        sessionFile,
      };

      // Write models.json
      writeModelsJson([model], this.modelsJsonPath);

      // Write metrics to file
      this.writeMetrics(metrics);

      // Generate status markdown for the model run
      const statusMd = generateStatusMd(metrics);
      const statusMdPath = path.join(this.settings.reviewOutputDir, `${model.name.replace(/\s+/g, '_')}_${runNumber}.md`);
      fs.writeFileSync(statusMdPath, statusMd);

      return metrics;
    } catch (e) {
      console.error(`Error running model ${model.name}:`, e);
      throw e;
    } finally {
      // Dispose sessions
      for (const s of sessions) {
        await s.dispose();
      }
    }
  }

  /**
   * Runs one benchmark session (one model, one run).
   */
  async runSingle(
    model: ModelConfig,
    promptText: string,
    promptNumber: number,
    iteration: number,
    runNumber: number
  ): Promise<RunMetrics> {
    console.log(`\nRunning single benchmark session for model: ${model.name}`);
    console.log(`Prompt: ${promptText.substring(0, 100)}...`);

    let session: BenchmarkSession | null = null;

    try {
      // Create session
      session = this.createSession(model);
      await session.init();

      // Run the prompt
      const result = await session.sendPrompt(promptText, promptNumber, iteration);

      // Calculate metrics
      const metrics: RunMetrics = {
        model: model.name,
        runNumber,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        prompts: [],
        completedTasks: result.completed ? 1 : 0,
        totalIterations: 1,
        totalInputTokens: result.inputTokens,
        totalOutputTokens: result.outputTokens,
        totalTimeMs: result.timeMs,
        generationTimeMinutes: 0,
        meanDecodeTps: 0,
        sessionFile: "",
      };

      return metrics;
    } catch (e) {
      console.error(`Error in runSingle:`, e);
      throw e;
    } finally {
      if (session) {
        await session.dispose();
      }
    }
  }

  /**
   * Helper for the per-prompt loop with validation and feedback.
   */
  async runPrompt(
    model: ModelConfig,
    session: BenchmarkSession,
    promptText: string,
    promptNumber: number,
    runNumber: number
  ): Promise<PromptResult> {
    const promptNumberFixed = promptNumber;
    const maxIterations = this.settings.maxIterationsPerPrompt;
    const stuckThreshold = this.settings.stuckThreshold;
    const iteration = 1;
    const validation = this.settings.validation;

    console.log(`\n  Starting prompt ${promptNumberFixed} iteration ${iteration}/${maxIterations}`);

    let inputTokens = 0;
    let outputTokens = 0;
    let timeMs = 0;
    let iterations = 0;
    let completed = false;
    let failureReason: string | undefined;
    const toolCalls: ToolCallRecord[] = [];
    const validationResults: ValidationResult[] = [];

    try {
      // Run the prompt
      const result = await session.sendPrompt(promptText, promptNumberFixed, iteration);

      inputTokens = result.inputTokens;
      outputTokens = result.outputTokens;
      timeMs = result.timeMs;
      iterations = iteration;
      completed = result.completed;
      toolCalls.push(...result.toolCalls);

      if (!completed) {
        failureReason = result.error || "Unknown error";
      }

      // Run validation
      console.log(`  Running validation for prompt ${promptNumberFixed}...`);
      const startTime = Date.now();
      const validationResult = await validateProject(this.resultsDir, validation);
      const validationTime = Date.now() - startTime;

      // Add validation results
      validationResults.push(validationResult.build);
      validationResults.push(validationResult.runtime);
      validationResults.push(validationResult.browser);

      // Compose feedback
      const feedback = composeFeedback(validationResults, promptNumberFixed);

      if (feedback) {
        console.log(`  Validation feedback: ${feedback.substring(0, 100)}...`);
      }

      // Check if stuck
      if (!completed) {
        const errorCount = this.countStuckErrors(validationResults);
        if (errorCount >= stuckThreshold) {
          throw new Error(`Stuck detection: ${model.name} failed ${errorCount} times, exceeding threshold ${stuckThreshold}`);
        }
      }

      return {
        promptNumber: promptNumberFixed,
        completed,
        iterations,
        failureReason,
        inputTokens,
        outputTokens,
        timeMs,
        toolCalls,
        validationResults,
      };
    } catch (e: any) {
      console.error(`  Prompt ${promptNumberFixed} error:`, e.message);
      failureReason = e.message;
      completed = false;

      // Add empty validation results
      validationResults.push({
        type: "build",
        passed: false,
        errors: [e.message],
        timestamp: Date.now(),
      });
      validationResults.push({
        type: "runtime",
        passed: false,
        errors: [e.message],
        timestamp: Date.now(),
      });
      validationResults.push({
        type: "browser",
        passed: false,
        errors: [e.message],
        timestamp: Date.now(),
      });

      return {
        promptNumber: promptNumberFixed,
        completed,
        iterations,
        failureReason,
        inputTokens,
        outputTokens,
        timeMs,
        toolCalls,
        validationResults,
      };
    }
  }

  /**
   * Creates a session for the given model.
   */
  private createSession(model: ModelConfig): BenchmarkSession {
    const modelDerivedProviderName = this.providerMap.get(model.name) || model.provider;
    const sessionDir = path.join(this.resultsDir, model.name.replace(/\s+/g, '_'));

    return new BenchmarkSession({
      modelConfig: model,
      projectDir: this.resultsDir,
      sessionDir,
      bareAgentDir: this.bareAgentDir,
      providerName: modelDerivedProviderName,
    });
  }

  /**
   * Writes metrics to a JSON file.
   */
  private writeMetrics(metrics: RunMetrics): void {
    const metricsJsonPath = path.join(this.resultsDir, "metrics.json");
    const metricsData = {
      model: metrics.model,
      runNumber: metrics.runNumber,
      metrics,
    };
    fs.writeFileSync(metricsJsonPath, JSON.stringify(metricsData, null, 2));
  }

  /**
   * Checks if metrics.json exists for resume capability.
   */
  private checkMetricsExists(model: string, runNumber: number): boolean {
    const metricsJsonPath = path.join(this.resultsDir, "metrics.json");
    return fs.existsSync(metricsJsonPath);
  }

  /**
   * Loads metrics from existing metrics.json file.
   */
  private loadMetrics(model: string, runNumber: number): RunMetrics {
    const metricsJsonPath = path.join(this.resultsDir, "metrics.json");
    const metricsData = JSON.parse(fs.readFileSync(metricsJsonPath, 'utf8'));
    return metricsData.metrics;
  }

  /**
   * Counts stuck errors in validation results.
   */
  private countStuckErrors(validationResults: ValidationResult[]): number {
    return validationResults.filter((r) => !r.passed).length;
  }
}