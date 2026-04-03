import type { RunMetrics, ReviewResult, ModelResults } from './types.js';

/**
 * Calculates the scored metric for a model run.
 * Formula: average of all reviewer overall scores
 * 
 * @param reviews - Array of review results
 * @returns Average overall score across all reviewers
 */
export function calculateScored(reviews: ReviewResult[]): number {
  if (reviews.length === 0) {
    return 0;
  }
  const totalScore = reviews.reduce((sum, review) => sum + review.scores.overallScore, 0);
  return totalScore / reviews.length;
}

/**
 * Calculates the measured metric for a model run.
 * Formula: scored * completionMultiplier - iterationPenalty
 * 
 * completionMultiplier = completedTasks / totalPrompts (0-1)
 * iterationPenalty = (totalIterations - totalPrompts) * 0.1
 * 
 * @param scored - The scored value
 * @param completedTasks - Number of completed prompts (0-5)
 * @param totalPrompts - Total number of prompts (5)
 * @param totalIterations - Total iterations across all prompts
 * @returns The measured score
 */
export function calculateMeasured(scored: number, completedTasks: number, totalPrompts: number, totalIterations: number): number {
  // Completion multiplier: ratio of completed tasks to total prompts
  const completionMultiplier = completedTasks / totalPrompts;
  
  // Iteration penalty: extra iterations beyond first-pass success
  // Each extra iteration reduces score by 0.1
  const extraIterations = totalIterations - totalPrompts;
  const iterationPenalty = extraIterations * 0.1;
  
  return scored * completionMultiplier - iterationPenalty;
}

/**
 * Calculates the AdamBench score for a model run.
 * Formula: measured - timePenalty
 * 
 * timePenalty = (totalTimeMs / 1000) / 60 - generationTimeMinutes
 * This penalizes slower models (higher time cost)
 * 
 * @param measured - The measured score
 * @param totalTimeMs - Total wall clock time in milliseconds
 * @param generationTimeMinutes - Generation time from model output
 * @returns The AdamBench score
 */
export function calculateAdamBench(measured: number, totalTimeMs: number, generationTimeMinutes: number): number {
  // Convert total time to minutes
  const totalTimeMinutes = totalTimeMs / (1000 * 60);
  
  // Time penalty: difference between actual time and generation time
  // Higher penalty for models that take longer than their generation time suggests
  const timePenalty = Math.max(0, totalTimeMinutes - generationTimeMinutes);
  
  return measured - timePenalty;
}

/**
 * Aggregates results across multiple runs for a single model.
 * Calculates average scored, measured, and adamBench with standard deviation.
 * 
 * @param model - Model name
 * @param runs - Array of run metrics
 * @param reviews - Array of review results
 * @returns Aggregated ModelResults object
 */
export function aggregateModelResults(
  model: string,
  runs: RunMetrics[],
  reviews: ReviewResult[]
): ModelResults {
  if (runs.length === 0) {
    return {
      model,
      runs: [],
      reviews: [],
      scored: 0,
      measured: 0,
      adamBench: 0,
      scoredStdDev: 0,
      adamBenchStdDev: 0,
    };
  }

  // Calculate scored: average of reviewer overall scores
  const scored = calculateScored(reviews);

  // Calculate measured for each run, then average
  const runsWithMeasured = runs.map((run) => {
    const measured = calculateMeasured(
      scored,
      run.completedTasks,
      run.prompts.length,
      run.totalIterations
    );
    return { ...run, measured };
  });

  const measured = runsWithMeasured.reduce((sum, run) => sum + run.measured, 0) / runs.length;

  // Calculate AdamBench for each run, then average
  const runsWithAdamBench = runsWithMeasured.map((run) => {
    const adamBench = calculateAdamBench(
      run.measured,
      run.totalTimeMs,
      run.generationTimeMinutes
    );
    return { ...run, adamBench };
  });

  const adamBench = runsWithAdamBench.reduce((sum, run) => sum + run.adamBench, 0) / runs.length;

  // Calculate standard deviation for scored
  const scoredStdDev = calculateStdDev(runs.map(() => scored));

  // Calculate standard deviation for adamBench
  const adamBenchStdDev = calculateStdDev(runs.map((run) => calculateAdamBench(
    scored,
    run.totalTimeMs,
    run.generationTimeMinutes
  )));

  return {
    model,
    runs: runs,
    reviews: reviews,
    scored,
    measured,
    adamBench,
    scoredStdDev,
    adamBenchStdDev,
  };
}

/**
 * Calculates standard deviation of an array of values.
 * @param values - Array of numeric values
 * @returns Standard deviation
 */
function calculateStdDev(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Calculates the AdamBench score for a single run.
 * This is useful for per-run scoring before aggregation.
 * 
 * @param scored - The scored value
 * @param completedTasks - Number of completed prompts
 * @param totalPrompts - Total number of prompts
 * @param totalIterations - Total iterations across all prompts
 * @param totalTimeMs - Total wall clock time
 * @param generationTimeMinutes - Generation time from model output
 * @returns AdamBench score
 */
export function calculateAdamBenchSingleRun(
  scored: number,
  completedTasks: number,
  totalPrompts: number,
  totalIterations: number,
  totalTimeMs: number,
  generationTimeMinutes: number
): number {
  const completionMultiplier = completedTasks / totalPrompts;
  const extraIterations = totalIterations - totalPrompts;
  const iterationPenalty = extraIterations * 0.1;
  const measured = scored * completionMultiplier - iterationPenalty;
  
  const totalTimeMinutes = totalTimeMs / (1000 * 60);
  const timePenalty = Math.max(0, totalTimeMinutes - generationTimeMinutes);
  
  return measured - timePenalty;
}