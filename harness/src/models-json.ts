import { ModelConfig } from './types';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Converts a model name to a unique Pi provider name (slugification).
 * Logic: lowercase, replace non-alphanumeric with hyphen, collapse hyphen, strip leading/trailing hyphen.
 * @param model The model configuration containing the name.
 * @returns The derived provider name string.
 */
export function deriveProviderName(model: ModelConfig): string {
  const name = model.name;
  // 1. Lowercase
  let slug = name.toLowerCase();
  // 2. Replace non-alphanumeric characters (and not hyphens) with a hyphen
  slug = slug.replace(/[^a-z0-9]+/g, '-');
  // 3. Collapse multiple hyphens
  slug = slug.replace(/-+/g, '-');
  // 4. Strip leading/trailing hyphen
  slug = slug.replace(/^-+|-+$/g, '');
  
  return `llama-${slug}`;
}

/**
 * Converts an array of ModelConfig into Pi's providers-keyed models.json format.
 * @param models Array of ModelConfig objects.
 * @returns An object containing the JSON structure and the provider map.
 */
export function generateModelsJson(models: ModelConfig[]): { json: object; providerMap: Map<string, string> } {
  const providerMap = new Map<string, string>();

  // Build providers object with nested models array
  const providers: Record<string, any> = {};

  for (const model of models) {
    const derivedProviderName = deriveProviderName(model);
    
    // Map original name to derived provider name
    providerMap.set(model.name, derivedProviderName);

    // Initialize provider if not exists
    if (!providers[derivedProviderName]) {
      providers[derivedProviderName] = {
        baseUrl: model.baseUrl,
        api: "openai-completions",
        apiKey: model.apiKey,
        compat: model.compat || {},
      };
    }

    // Add model to provider's models array
    if (!providers[derivedProviderName].models) {
      providers[derivedProviderName].models = [];
    }
    providers[derivedProviderName].models.push({
      id: model.modelId,
      name: model.name,
      contextWindow: model.contextWindow,
      maxTokens: model.maxTokens || 16384,
      reasoning: model.reasoning || false,
    });
  }

  return { json: { providers }, providerMap };
}

/**
 * Writes the generated models.json to the specified output path and returns the provider map.
 * @param models Array of ModelConfig objects.
 * @param outputPath The file path where models.json should be written.
 * @returns The provider map generated during the process.
 */
export function writeModelsJson(models: ModelConfig[], outputPath: string): Map<string, string> {
  const { json, providerMap } = generateModelsJson(models);

  try {
    // Ensure directory exists before writing
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the JSON content
    fs.writeFileSync(outputPath, JSON.stringify(json, null, 2), 'utf8');
    console.log(`Successfully wrote models.json to ${outputPath}`);
    return providerMap;
  } catch (e) {
    console.error(`Error writing models.json to ${outputPath}:`, e);
    throw new Error(`Failed to write models configuration file: ${(e as Error).message}`);
  }
}
