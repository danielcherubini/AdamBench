import * as fs from 'fs';
import { parse } from 'yaml';
import { ModelConfig, BenchmarkSettings, ValidationSettings } from './types.js';
import * as path from 'path';

// --- Configuration Loading Functions ---

/**
 * Loads and validates models configuration from a YAML file.
 * @param yamlPath Path to models.yaml
 * @returns Array of ModelConfig objects
 */
export function loadModelsConfig(yamlPath: string): ModelConfig[] {
  try {
    const fileContents = fs.readFileSync(yamlPath, 'utf8');
    const data = parse(fileContents) as { models: ModelConfig[] };

    if (!data || !data.models || !Array.isArray(data.models)) {
      throw new Error("Invalid models configuration structure in YAML file.");
    }

    const models: ModelConfig[] = data.models.map((model, index) => {
      // W1: Required field validation - Fixed check to correctly handle 0 values
      if (!model.name || !model.provider || !model.baseUrl || !model.modelId || !model.apiKey || model.contextWindow == null) {
        throw new Error(`Model at index ${index} is missing one or more required fields: name, provider, baseUrl, modelId, apiKey, contextWindow.`);
      }
      return {
        name: model.name,
        provider: model.provider,
        baseUrl: model.baseUrl,
        modelId: model.modelId,
        apiKey: model.apiKey || "not-needed",
        contextWindow: model.contextWindow,
        maxTokens: model.maxTokens || 16384,
        reasoning: model.reasoning || false,
        compat: model.compat || {},
      };
    });

    return models;
  } catch (e) {
    console.error(`Error loading models config from ${yamlPath}:`, e);
    throw new Error(`Failed to load or parse models configuration: ${(e as Error).message}`);
  }
}

/**
 * Loads and validates benchmark settings from a YAML file, filling in defaults and resolving paths.
 * @param yamlPath Path to settings.yaml
 * @param repoRoot The root directory of the repository
 * @returns BenchmarkSettings object
 */
export function loadSettings(yamlPath: string, repoRoot: string): BenchmarkSettings {
  try {
    const fileContents = fs.readFileSync(yamlPath, 'utf8');
    const data = parse(fileContents) as {
      runsPerModel?: number;
      maxIterationsPerPrompt?: number;
      stuckThreshold?: number;
      validation?: ValidationSettings;
      reviewers?: { name: string, provider: string, modelId: string }[];
    };

    if (!data) {
      throw new Error("Invalid settings configuration structure in YAML file.");
    }

    // W3: Null-safety for nested objects
    const validationData = data.validation || {};
    const reviewerData = data.reviewers || [];

    // W5: Add null-check warning if no reviewers are configured
    if (reviewerData.length === 0) {
        console.warn("Warning: no reviewers configured in settings.yaml. Benchmarks will run without external review.");
    }

    // W2: Correct default logic using nullish coalescing (??)
    const settings: BenchmarkSettings = {
      runsPerModel: data.runsPerModel ?? 3,
      maxIterationsPerPrompt: data.maxIterationsPerPrompt ?? 5,
      stuckThreshold: data.stuckThreshold ?? 3,
      // W4: Use path.resolve for absolute paths
      promptsDir: path.resolve(repoRoot, 'prompts'),
      outputDir: path.resolve(repoRoot, 'runs'),
      reviewOutputDir: path.resolve(repoRoot, 'review_outputs_v2'),
      resultsDir: path.resolve(repoRoot, 'results'),
      validation: {
        npmInstallTimeoutMs: validationData.npmInstallTimeoutMs ?? 120000,
        buildTimeoutMs: validationData.buildTimeoutMs ?? 120000,
        devServerStartupMs: validationData.devServerStartupMs ?? 15000,
        browserCheckTimeoutMs: validationData.browserCheckTimeoutMs ?? 30000,
        // Corrected default logic
        screenshotOnFailure: validationData.screenshotOnFailure ?? true,
        screenshotOnSuccess: validationData.screenshotOnSuccess ?? false,
      },
      reviewers: reviewerData.map(r => ({
        name: r.name,
        provider: r.provider,
        modelId: r.modelId,
      }))
    };

    return settings;
  } catch (e) {
    console.error(`Error loading settings config from ${yamlPath}:`, e);
    throw new Error(`Failed to load or parse settings configuration: ${(e as Error).message}`);
  }
}

/**
 * Reads prompt files sequentially from a specified directory.
 * @param promptsDir Directory containing prompt files (e.g., prompt1.md, prompt2.md, etc.)
 * @returns Array of prompt file contents in order.
 */
export function loadPrompts(promptsDir: string): string[] { // C5: Synchronous signature
  const prompts: string[] = [];
  const filePattern = 'prompt[1-5]\\.md'; // W3: Explicit anchored regex pattern
  
  try {
    // C4: Replacing glob with synchronous file reading loop
    const files = fs.readdirSync(promptsDir).filter(file => new RegExp(filePattern).test(file));
    files.sort(); // Ensure correct order
    
    // W2: Assert exactly 5 prompts are found
    if (files.length !== 5) {
        throw new Error(`Expected 5 prompt files, found ${files.length}.`);
    }
    
    for (const file of files) {
        const filePath = path.join(promptsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        prompts.push(content);
    }
  } catch (e) {
    console.error("Error loading prompts:", e);
    throw new Error(`Failed to load prompts from ${promptsDir}: ${(e as Error).message}`);
  }
  
  return prompts;
}
