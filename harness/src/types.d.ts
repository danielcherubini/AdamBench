export interface ModelConfig {
    name: string;
    provider: string;
    baseUrl: string;
    modelId: string;
    apiKey: string;
    contextWindow: number;
    maxTokens?: number;
    reasoning?: boolean;
    compat?: Record<string, any>;
}
export interface ReviewerConfig {
    name: string;
    provider: string;
    modelId: string;
}
export interface BenchmarkSettings {
    runsPerModel: number;
    maxIterationsPerPrompt: number;
    stuckThreshold: number;
    promptsDir: string;
    outputDir: string;
    reviewOutputDir: string;
    resultsDir: string;
    validation: ValidationSettings;
    reviewers: ReviewerConfig[];
}
export interface ValidationSettings {
    npmInstallTimeoutMs: number;
    buildTimeoutMs: number;
    devServerStartupMs: number;
    browserCheckTimeoutMs: number;
    screenshotOnFailure: boolean;
    screenshotOnSuccess: boolean;
}
export interface ToolCallRecord {
    toolName: string;
    promptNumber: number;
    iteration: number;
    durationMs: number;
    args?: Record<string, any>;
}
export interface ValidationResult {
    type: "build" | "runtime" | "browser";
    passed: boolean;
    errors: string[];
    screenshots?: string[];
    consoleErrors?: string[];
    timestamp: number;
}
export interface PromptResult {
    promptNumber: number;
    completed: boolean;
    iterations: number;
    failureReason?: string;
    inputTokens: number;
    outputTokens: number;
    timeMs: number;
    toolCalls: ToolCallRecord[];
    validationResults: ValidationResult[];
}
export interface RunMetrics {
    model: string;
    runNumber: number;
    startedAt: string;
    completedAt: string;
    prompts: PromptResult[];
    completedTasks: number;
    totalIterations: number;
    totalInputTokens: number;
    totalOutputTokens: number;
    totalTimeMs: number;
    generationTimeMinutes: number;
    meanDecodeTps: number;
    sessionFile: string;
}
export interface ReviewScores {
    taskCompletion: number;
    correctness: number;
    codeQuality: number;
    architectureMaintainability: number;
    simplicityVsOverengineering: number;
    overallProjectQuality: number;
    overallScore: number;
    comment: string;
}
export interface ReviewResult {
    reviewer: string;
    model: string;
    runNumber: number;
    scores: ReviewScores;
    rawMarkdown: string;
}
export interface ModelResults {
    model: string;
    runs: RunMetrics[];
    reviews: ReviewResult[];
    scored: number;
    measured: number;
    adamBench: number;
    scoredStdDev: number;
    adamBenchStdDev: number;
}
//# sourceMappingURL=types.d.ts.map