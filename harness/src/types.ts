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
  resume?: boolean; // Default false
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