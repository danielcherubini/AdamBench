#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { BenchmarkRunner } from './runner.js';
import { Reporter } from './reporter.js';
import type {
  ModelConfig,
  BenchmarkSettings,
  ReviewerConfig,
} from './types.js';
import {
  calculateScored,
  calculateMeasured,
  calculateAdamBench,
  aggregateModelResults,
} from './metrics.js';

/**
 * AdamBench CLI - Main entry point
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  const helpText = `
AdamBench CLI

Usage: adambench <command> [options]

Commands:
  benchmark  Run benchmark on all models
  review     Review benchmark results
  score      Calculate scores for models
  report     Generate reports (CSV/JSON)
  status     Show status of all models

Examples:
  adambench benchmark
  adambench review
  adambench score
  adambench report
  adambench status
`;

  // Default configuration
  const defaultConfig: BenchmarkSettings = {
    runsPerModel: 3,
    maxIterationsPerPrompt: 5,
    stuckThreshold: 3,
    promptsDir: '../prompts',
    outputDir: '../runs',
    reviewOutputDir: '../review_outputs_v2',
    resultsDir: '../results',
    validation: {
      npmInstallTimeoutMs: 120000,
      buildTimeoutMs: 120000,
      devServerStartupMs: 15000,
      browserCheckTimeoutMs: 30000,
      screenshotOnFailure: true,
      screenshotOnSuccess: false,
    },
    reviewers: [],
    resume: false,
  };

  // Load models.json if it exists
  const modelsJsonPath = path.join(process.cwd(), 'models.json');
  let models: ModelConfig[] = [];
  let providerMap: Map<string, string> | null = null;

  if (fs.existsSync(modelsJsonPath)) {
    const modelsData = JSON.parse(fs.readFileSync(modelsJsonPath, 'utf8'));
    models = modelsData.models || [];
    providerMap = new Map(Object.entries(modelsData.providerMap || {}));
  }

  switch (command) {
    case 'benchmark':
      await runBenchmark(models, defaultConfig);
      break;
    case 'review':
      await runReview(models, defaultConfig);
      break;
    case 'score':
      await runScore(models, defaultConfig);
      break;
    case 'report':
      await runReport(models, defaultConfig);
      break;
    case 'status':
      await runStatus(models, defaultConfig);
      break;
    case undefined:
    case 'help':
      console.log(helpText);
      break;
    default:
      console.error(`Unknown command: ${command}`);
      console.log(helpText);
      process.exit(1);
  }
}

/**
 * Runs benchmark on all models
 */
async function runBenchmark(models: ModelConfig[], config: BenchmarkSettings): Promise<void> {
  console.log('Starting benchmark...\n');
  console.log('Models to benchmark:');
  for (const model of models) {
    console.log(`  - ${model.name} (${model.provider})`);
  }
  console.log('\n');

  const runner = new BenchmarkRunner(models, config, [], new Map<string, string>(), '', '');
  const metrics = await runner.runAll();

  console.log(`\nBenchmark completed. Ran ${metrics.length} model(s).`);
}

/**
 * Reviews benchmark results
 */
async function runReview(models: ModelConfig[], config: BenchmarkSettings): Promise<void> {
  console.log('Starting review...\n');

  // Check if metrics exist
  const metricsJsonPath = path.join(config.resultsDir, 'metrics.json');
  if (!fs.existsSync(metricsJsonPath)) {
    console.error('No metrics found. Run benchmark first.');
    process.exit(1);
  }

  const metricsData = JSON.parse(fs.readFileSync(metricsJsonPath, 'utf8'));
  const metrics = metricsData.metrics;

  console.log(`Found ${metrics.length} run(s) to review.`);
  console.log('\nReview outputs:');
  for (const metric of metrics) {
    console.log(`  - ${metric.model.replace(/\s+/g, '_')}_${metric.runNumber}.md`);
  }
  console.log('\nReview completed.');
}

/**
 * Calculates scores for models
 */
async function runScore(models: ModelConfig[], config: BenchmarkSettings): Promise<void> {
  console.log('Calculating scores...\n');

  // Check if metrics exist
  const metricsJsonPath = path.join(config.resultsDir, 'metrics.json');
  if (!fs.existsSync(metricsJsonPath)) {
    console.error('No metrics found. Run benchmark first.');
    process.exit(1);
  }

  const metricsData = JSON.parse(fs.readFileSync(metricsJsonPath, 'utf8'));
  const metrics = metricsData.metrics;

  // Calculate scores for each model
  for (const metric of metrics) {
    const scored = calculateScored([]); // Placeholder - reviews would be loaded from files
    const measured = calculateMeasured(
      scored,
      metric.completedTasks,
      metric.prompts.length,
      metric.totalIterations
    );
    const adamBench = calculateAdamBench(
      measured,
      metric.totalTimeMs,
      metric.generationTimeMinutes
    );

    console.log(`${metric.model}:`);
    console.log(`  Scored:     ${scored.toFixed(2)}`);
    console.log(`  Measured:   ${measured.toFixed(2)}`);
    console.log(`  AdamBench:  ${adamBench.toFixed(2)}`);
    console.log();
  }

  console.log('Scores calculated.');
}

/**
 * Generates reports
 */
async function runReport(models: ModelConfig[], config: BenchmarkSettings): Promise<void> {
  console.log('Generating reports...\n');

  // Check if metrics exist
  const metricsJsonPath = path.join(config.resultsDir, 'metrics.json');
  if (!fs.existsSync(metricsJsonPath)) {
    console.error('No metrics found. Run benchmark first.');
    process.exit(1);
  }

  const metricsData = JSON.parse(fs.readFileSync(metricsJsonPath, 'utf8'));
  const metrics = metricsData.metrics;

  const resultsDir = config.resultsDir;
  const reviewOutputDir = config.reviewOutputDir;

  const reporter = new Reporter(resultsDir, reviewOutputDir);
  const modelResults = metrics.map((metric: any) => ({
    model: metric.model,
    runs: [metric],
    reviews: [],
    scored: 0,
    measured: 0,
    adamBench: 0,
    scoredStdDev: 0,
    adamBenchStdDev: 0,
  }));

  reporter.generateReports(modelResults);
  reporter.generateDetailedCsvReport(modelResults);
  reporter.generateSummaryReport(modelResults);

  console.log('Reports generated.');
}

/**
 * Shows status of all models
 */
async function runStatus(models: ModelConfig[], config: BenchmarkSettings): Promise<void> {
  console.log('Model Status:\n');

  for (const model of models) {
    console.log(`Model: ${model.name}`);
    console.log(`  Provider: ${model.provider}`);
    console.log(`  Base URL: ${model.baseUrl}`);
    console.log(`  Model ID: ${model.modelId}`);
    console.log(`  Context Window: ${model.contextWindow}`);
    console.log();
  }
}

// Run main
main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});