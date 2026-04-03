import { ModelConfig } from './types';
/**
 * Converts a model name to a unique Pi provider name (slugification).
 * Logic: lowercase, replace non-alphanumeric with hyphen, collapse hyphen, strip leading/trailing hyphen.
 * @param model The model configuration containing the name.
 * @returns The derived provider name string.
 */
export declare function deriveProviderName(model: ModelConfig): string;
/**
 * Converts an array of ModelConfig into Pi's models.json format, generating a providerMap.
 * @param models Array of ModelConfig objects.
 * @returns An object containing the JSON structure and the provider map.
 */
export declare function generateModelsJson(models: ModelConfig[]): {
    json: object;
    providerMap: Map<string, string>;
};
/**
 * Writes the generated models.json to the specified output path and returns the provider map.
 * @param models Array of ModelConfig objects.
 * @param outputPath The file path where models.json should be written.
 * @returns The provider map generated during the process.
 */
export declare function writeModelsJson(models: ModelConfig[], outputPath: string): Map<string, string>;
//# sourceMappingURL=models-json.d.ts.map