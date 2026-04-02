import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { ModelConfig, BenchmarkSettings, ValidationSettings } from './types.ts';

// --- Configuration Loading Functions ---

/**
 * Loads and validates models configuration from a YAML file.
 * @param yamlPath Path to models.yaml
 * @returns Array of ModelConfig objects
 */
export function loadModelsConfig(yamlPath: string): ModelConfig[] {
  try {
    const fileContents = fs.readFileSync(yamlPath, 'utf8');
    const data = yaml.load(fileContents) as { models: ModelConfig[] };

    if (!data || !data.models || !Array.isArray(data.models)) {
      throw new Error("Invalid models configuration structure in YAML file.");
    }

    // Basic validation and defaulting (contextWindow is mandatory, others might be optional)
    const models: ModelConfig[] = data.models.map(model => ({
      name: model.name,
      provider: model.provider,
      baseUrl: model.baseUrl,
      modelId: model.modelId,
      apiKey: model.apiKey || "not-needed", // Defaulting API key if missing
      contextWindow: model.contextWindow,
      maxTokens: model.maxTokens || 16384, // Applying default from types.ts
      reasoning: model.reasoning || false, // Applying default from types.ts
      compat: model.compat || {},
    }));

    // Further validation could check for required fields, but we trust the structure for now.
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
    const data = yaml.load(fileContents) as {
      runsPerModel: number;
      maxIterationsPerPrompt: number;
      stuckThreshold: number;
      validation: ValidationSettings;
      reviewers: { name: string, provider: string, modelId: string }[];
    };

    if (!data) {
        throw new Error("Invalid settings configuration structure in YAML file.");
    }

    // Apply defaults for BenchmarkSettings
    const settings: BenchmarkSettings = {
      runsPerModel: data.runsPerModel || 3,
      maxIterationsPerPrompt: data.maxIterationsPerPrompt || 5,
      stuckThreshold: data.stuckThreshold || 3,
      promptsDir: `${repoRoot}/prompts`, // Assuming prompts are relative to root
      outputDir: `${repoRoot}/runs`, // Assuming runs are relative to root
      reviewOutputDir: `${repoRoot}/review_outputs_v2`,
      resultsDir: `${repoRoot}/results`,
      validation: {
        npmInstallTimeoutMs: data.validation.npmInstallTimeoutMs || 120000,
        buildTimeoutMs: data.validation.buildTimeoutMs || 120000,
        devServerStartupMs: data.validation.devServerStartupMs || 15000,
        browserCheckTimeoutMs: data.validation.browserCheckTimeoutMs || 30000,
        screenshotOnFailure: data.validation.screenshotOnFailure || true,
        screenshotOnSuccess: data.validation.screenshotOnSuccess || false,
      },
      reviewers: data.reviewers.map(r => ({
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
export async function loadPrompts(promptsDir: string): Promise<string[]> {
  const prompts = [];
  const filePattern = 'prompt[1-5].md';
  
  try {
    // Use glob to find all matching files, which should be sorted by name/order
    const files = await import('./utils/glob').then(utils => utils.glob(promptsDir, filePattern));

    for (const filePath of files) {
        const content = await fs.promises.readFile(filePath, 'utf8');
        prompts.push(content);
    }
  } catch (e) {
    console.error("Error loading prompts:", e);
    throw new Error(`Failed to load prompts from ${promptsDir}: ${(e as Error).message}`);
  }

  return prompts;
}

// --- Configuration Loading Functions ---

/**
 * Loads and validates models configuration from a YAML file.
 * @param yamlPath Path to models.yaml
 * @returns Array of ModelConfig objects
 */
export function loadModelsConfig(yamlPath: string): ModelConfig[] {
  try {
    const fileContents = fs.readFileSync(yamlPath, 'utf8');
    const data = yaml.load(fileContents) as { models: ModelConfig[] };

    if (!data || !data.models || !Array.isArray(data.models)) {
      throw new Error("Invalid models configuration structure in YAML file.");
    }

    // Basic validation and defaulting (contextWindow is mandatory, others might be optional)
    const models: ModelConfig[] = data.models.map(model => ({
      name: model.name,
      provider: model.provider,
      baseUrl: model.baseUrl,
      modelId: model.modelId,
      apiKey: model.apiKey || "not-needed", // Defaulting API key if missing
      contextWindow: model.contextWindow,
      maxTokens: model.maxTokens || 16384, // Applying default from types.ts
      reasoning: model.reasoning || false, // Applying default from types.ts
      compat: model.compat || {},
    }));

    // Further validation could check for required fields, but we trust the structure for now.
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
    const data = yaml.load(fileContents) as {
      runsPerModel: number;
      maxIterationsPerPrompt: number;
      stuckThreshold: number;
      validation: ValidationSettings;
      reviewers: { name: string, provider: string, modelId: string }[];
    };

    if (!data) {
        throw new Error("Invalid settings configuration structure in YAML file.");
    }

    // Apply defaults for BenchmarkSettings
    const settings: BenchmarkSettings = {
      runsPerModel: data.runsPerModel || 3,
      maxIterationsPerPrompt: data.maxIterationsPerPrompt || 5,
      stuckThreshold: data.stuckThreshold || 3,
      promptsDir: `${repoRoot}/prompts`, // Assuming prompts are relative to root
      outputDir: `${repoRoot}/runs`, // Assuming runs are relative to root
      reviewOutputDir: `${repoRoot}/review_outputs_v2`,
      resultsDir: `${repoRoot}/results`,
      validation: {
        npmInstallTimeoutMs: data.validation.npmInstallTimeoutMs || 120000,
        buildTimeoutMs: data.validation.buildTimeoutMs || 120000,
        devServerStartupMs: data.validation.devServerStartupMs || 15000,
        browserCheckTimeoutMs: data.validation.browserCheckTimeoutMs || 30000,
        screenshotOnFailure: data.validation.screenshotOnFailure || true,
        screenshotOnSuccess: data.validation.screenshotOnSuccess || false,
      },
      reviewers: data.reviewers.map(r => ({
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
export async function loadPrompts(promptsDir: string): Promise<string[]> {
  const prompts = [];
  const filePattern = 'prompt[1-5].md';
  
  try {
    // Use glob to find all matching files, which should be sorted by name/order
    const files = await import('./utils/glob').then(utils => utils.glob(promptsDir, filePattern));

    for (const filePath of files) {
        const content = await fs.promises.readFile(filePath, 'utf8');
        prompts.push(content);
    }
  } catch (e) {
    console.error("Error loading prompts:", e);
    throw new Error(`Failed to load prompts from ${promptsDir}: ${(e as Error).message}`);
  }

  return prompts;
}

// --- Configuration Loading Functions ---

/**
 * Loads and validates models configuration from a YAML file.
 * @param yamlPath Path to models.yaml
 * @returns Array of ModelConfig objects
 */
export function loadModelsConfig(yamlPath: string): ModelConfig[] {
  try {
    const fileContents = fs.readFileSync(yamlPath, 'utf8');
    const data = yaml.load(fileContents) as { models: ModelConfig[] };

    if (!data || !data.models || !Array.isArray(data.models)) {
      throw new Error("Invalid models configuration structure in YAML file.");
    }

    // Basic validation and defaulting (contextWindow is mandatory, others might be optional)
    const models: ModelConfig[] = data.models.map(model => ({
      name: model.name,
      provider: model.provider,
      baseUrl: model.baseUrl,
      modelId: model.modelId,
      apiKey: model.apiKey || "not-needed", // Defaulting API key if missing
      contextWindow: model.contextWindow,
      maxTokens: model.maxTokens || 16384, // Applying default from types.ts
      reasoning: model.reasoning || false, // Applying default from types.ts
      compat: model.compat || {},
    }));

    // Further validation could check for required fields, but we trust the structure for now.
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
    const data = yaml.load(fileContents) as {
      runsPerModel: number;
      maxIterationsPerPrompt: number;
      stuckThreshold: number;
      validation: ValidationSettings;
      reviewers: { name: string, provider: string, modelId: string }[];
    };

    if (!data) {
        throw new Error("Invalid settings configuration structure in YAML file.");
    }

    // Apply defaults for BenchmarkSettings
    const settings: BenchmarkSettings = {
      runsPerModel: data.runsPerModel || 3,
      maxIterationsPerPrompt: data.maxIterationsPerPrompt || 5,
      stuckThreshold: data.stuckThreshold || 3,
      promptsDir: `${repoRoot}/prompts`, // Assuming prompts are relative to root
      outputDir: `${repoRoot}/runs`, // Assuming runs are relative to root
      reviewOutputDir: `${repoRoot}/review_outputs_v2`,
      resultsDir: `${repoRoot}/results`,
      validation: {
        npmInstallTimeoutMs: data.validation.npmInstallTimeoutMs || 120000,
        buildTimeoutMs: data.validation.buildTimeoutMs || 120000,
        devServerStartupMs: data.validation.devServerStartupMs || 15000,
        browserCheckTimeoutMs: data.validation.browserCheckTimeoutMs || 30000,
        screenshotOnFailure: data.validation.screenshotOnFailure || true,
        screenshotOnSuccess: data.validation.screenshotOnSuccess || false,
      },
      reviewers: data.reviewers.map(r => ({
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
export async function loadPrompts(promptsDir: string): Promise<string[]> {
  const prompts = [];
  const filePattern = 'prompt[1-5].md';
  
  try {
    // Use glob to find all matching files, which should be sorted by name/order
    const files = await import('./utils/glob').then(utils => utils.glob(promptsDir, filePattern));

    for (const filePath of files) {
        const content = await fs.promises.readFile(filePath, 'utf8');
        prompts.push(content);
    }
  } catch (e) {
    console.error("Error loading prompts:", e);
    throw new Error(`Failed to load prompts from ${promptsDir}: ${(e as Error).message}`);
  }

  return prompts;
}

// --- Configuration Loading Functions ---

/**
 * Loads and validates models configuration from a YAML file.
 * @param yamlPath Path to models.yaml
 * @returns Array of ModelConfig objects
 */
export function loadModelsConfig(yamlPath: string): ModelConfig[] {
  try {
    const fileContents = fs.readFileSync(yamlPath, 'utf8');
    const data = yaml.load(fileContents) as { models: ModelConfig[] };

    if (!data || !data.models || !Array.isArray(data.models)) {
      throw new Error("Invalid models configuration structure in YAML file.");
    }

    // Basic validation and defaulting (contextWindow is mandatory, others might be optional)
    const models: ModelConfig[] = data.models.map(model => ({
      name: model.name,
      provider: model.provider,
      baseUrl: model.baseUrl,
      modelId: model.modelId,
      apiKey: model.apiKey || "not-needed", // Defaulting API key if missing
      contextWindow: model.contextWindow,
      maxTokens: model.maxTokens || 16384, // Applying default from types.ts
      reasoning: model.reasoning || false, // Applying default from types.ts
      compat: model.compat || {},
    }));

    // Further validation could check for required fields, but we trust the structure for now.
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
    const data = yaml.load(fileContents) as {
      runsPerModel: number;
      maxIterationsPerPrompt: number;
      stuckThreshold: number;
      validation: ValidationSettings;
      reviewers: { name: string, provider: string, modelId: string }[];
    };

    if (!data) {
        throw new Error("Invalid settings configuration structure in YAML file.");
    }

    // Apply defaults for BenchmarkSettings
    const settings: BenchmarkSettings = {
      runsPerModel: data.runsPerModel || 3,
      maxIterationsPerPrompt: data.maxIterationsPerPrompt || 5,
      stuckThreshold: data.stuckThreshold || 3,
      promptsDir: `${repoRoot}/prompts`, // Assuming prompts are relative to root
      outputDir: `${repoRoot}/runs`, // Assuming runs are relative to root
      reviewOutputDir: `${repoRoot}/review_outputs_v2`,
      resultsDir: `${repoRoot}/results`,
      validation: {
        npmInstallTimeoutMs: data.validation.npmInstallTimeoutMs || 120000,
        buildTimeoutMs: data.validation.buildTimeoutMs || 120000,
        devServerStartupMs: data.validation.devServerStartupMs || 15000,
        browserCheckTimeoutMs: data.validation.browserCheckTimeoutMs || 30000,
        screenshotOnFailure: data.validation.screenshotOnFailure || true,
        screenshotOnSuccess: data.validation.screenshotOnSuccess || false,
      },
      reviewers: data.reviewers.map(r => ({
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
export async function loadPrompts(promptsDir: string): Promise<string[]> {
  const prompts = [];
  const filePattern = 'prompt[1-5].md';
  
  try {
    // Use glob to find all matching files, which should be sorted by name/order
    // NOTE: Assuming ./utils/glob exists or needs to be mocked/fixed if it's not present.
    // Since glob was used in the original implementation, I will keep it, assuming it's available or will be resolved by the environment.
    const files = await import('./utils/glob').then(utils => utils.glob(promptsDir, filePattern));

    for (const filePath of files) {
        const content = await fs.promises.readFile(filePath, 'utf8');
        prompts.push(content);
    }
  } catch (e) {
    console.error("Error loading prompts:", e);
    throw new Error(`Failed to load prompts from ${promptsDir}: ${(e as Error).message}`);
  }

  return prompts;
}

// --- Configuration Loading Functions ---

/**
 * Loads and validates models configuration from a YAML file.
 * @param yamlPath Path to models.yaml
 * @returns Array of ModelConfig objects
 */
export function loadModelsConfig(yamlPath: string): ModelConfig[] {
  try {
    const fileContents = fs.readFileSync(yamlPath, 'utf8');
    const data = yaml.load(fileContents) as { models: ModelConfig[] };

    if (!data || !data.models || !Array.isArray(data.models)) {
      throw new Error("Invalid models configuration structure in YAML file.");
    }

    // Basic validation and defaulting (contextWindow is mandatory, others might be optional)
    const models: ModelConfig[] = data.models.map(model => ({
      name: model.name,
      provider: model.provider,
      baseUrl: model.baseUrl,
      modelId: model.modelId,
      apiKey: model.apiKey || "not-needed", // Defaulting API key if missing
      contextWindow: model.contextWindow,
      maxTokens: model.maxTokens || 16384, // Applying default from types.ts
      reasoning: model.reasoning || false, // Applying default from types.ts
      compat: model.compat || {},
    }));

    // Further validation could check for required fields, but we trust the structure for now.
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
    const data = yaml.load(fileContents) as {
      runsPerModel: number;
      maxIterationsPerPrompt: number;
      stuckThreshold: number;
      validation: ValidationSettings;
      reviewers: { name: string, provider: string, modelId: string }[];
    };

    if (!data) {
        throw new Error("Invalid settings configuration structure in YAML file.");
    }

    // Apply defaults for BenchmarkSettings
    const settings: BenchmarkSettings = {
      runsPerModel: data.runsPerModel || 3,
      maxIterationsPerPrompt: data.maxIterationsPerPrompt || 5,
      stuckThreshold: data.stuckThreshold || 3,
      promptsDir: `${repoRoot}/prompts`, // Assuming prompts are relative to root
      outputDir: `${repoRoot}/runs`, // Assuming runs are relative to root
      reviewOutputDir: `${repoRoot}/review_outputs_v2`,
      resultsDir: `${repoRoot}/results`,
      validation: {
        npmInstallTimeoutMs: data.validation.npmInstallTimeoutMs || 120000,
        buildTimeoutMs: data.validation.buildTimeoutMs || 120000,
        devServerStartupMs: data.validation.devServerStartupMs || 15000,
        browserCheckTimeoutMs: data.validation.browserCheckTimeoutMs || 30000,
        screenshotOnFailure: data.validation.screenshotOnFailure || true,
        screenshotOnSuccess: data.validation.screenshotOnSuccess || false,
      },
      reviewers: data.reviewers.map(r => ({
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
export async function loadPrompts(promptsDir: string): Promise<string[]> {
  const prompts = [];
  const filePattern = 'prompt[1-5].md';
  
  try {
    // Use glob to find all matching files, which should be sorted by name/order
    const files = await import('./utils/glob').then(utils => utils.glob(promptsDir, filePattern));

    for (const filePath of files) {
        const content = await fs.promises.readFile(filePath, 'utf8');
        prompts.push(content);
    }
  } catch (e) {
    console.error("Error loading prompts:", e);
    throw new Error(`Failed to load prompts from ${promptsDir}: ${(e as Error).message}`);
  }

  return prompts;
}