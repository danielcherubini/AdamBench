# Phase 2: Configuration System

**Depends on:** [Phase 1](phase-1-scaffolding.md)
**Next phase:** [Phase 3 — Pi Session](phase-3-pi-session.md)

---

## Task 2.1: Create config files and loader

**Context:**
The harness needs two YAML config files at the repo root's `config/` directory: one defining which models to test (with their llama-server URLs and compat settings), and one for benchmark settings (runs per model, timeouts, reviewer models). A config loader in the harness reads these files, validates them, fills in defaults, and returns typed objects.

Additionally, Pi's SDK discovers models via a `models.json` file — this module generates that file from the YAML config. The tricky part: all local models share `provider: "llama-server"` in the YAML, but Pi needs unique provider names per model to avoid registry collisions (since you swap the model in llama-server between runs). So each model gets its own derived provider name (e.g. `"Qwen3.5-122b-A10b"` → `"llama-qwen35-122b-a10b"`). This mapping flows through to Phase 3's Pi session creation.

**Files:**
- Create: `config/models.yaml`
- Create: `config/settings.yaml`
- Create: `harness/src/config.ts`
- Create: `harness/src/models-json.ts`

**What to implement:**

### `config/models.yaml`

```yaml
models:
  - name: "Qwen3.5-122b-A10b"
    provider: "llama-server"
    baseUrl: "http://192.168.1.100:8080/v1"
    modelId: "local-model"
    apiKey: "not-needed"
    contextWindow: 32768
    maxTokens: 16384
    reasoning: false
    compat:
      supportsDeveloperRole: false
      supportsReasoningEffort: false

  - name: "gpt-oss-120b"
    provider: "llama-server"
    baseUrl: "http://192.168.1.100:8080/v1"
    modelId: "local-model"
    apiKey: "not-needed"
    contextWindow: 32768
    maxTokens: 16384
    reasoning: false
    compat:
      supportsDeveloperRole: false
      supportsReasoningEffort: false
```

### `config/settings.yaml`

```yaml
runsPerModel: 3
maxIterationsPerPrompt: 5
stuckThreshold: 3

validation:
  npmInstallTimeoutMs: 120000
  buildTimeoutMs: 120000
  devServerStartupMs: 15000
  browserCheckTimeoutMs: 30000
  screenshotOnFailure: true
  screenshotOnSuccess: false

reviewers:
  - name: "Sonnet4.6"
    provider: "anthropic"
    modelId: "claude-sonnet-4-6"
  - name: "GPT-5.4"
    provider: "openai"
    modelId: "gpt-5.4"
```

### `harness/src/config.ts`

Implement three exported functions:

```typescript
import { parse } from "yaml";
import { readFileSync, readdirSync } from "fs";
import { join, resolve } from "path";
import type { ModelConfig, BenchmarkSettings } from "./types.js";

// Load and validate models.yaml. Throws with a clear message if required fields are missing.
export function loadModelsConfig(yamlPath: string): ModelConfig[]

// Load and validate settings.yaml. Fills in defaults for any missing optional fields.
// Resolves promptsDir, outputDir, reviewOutputDir, resultsDir to absolute paths
// relative to the repo root (one level above harness/).
export function loadSettings(yamlPath: string, repoRoot: string): BenchmarkSettings

// Read prompt1.md through prompt5.md from promptsDir in order.
// Returns an array of 5 strings — the raw text content of each prompt file.
// Throws if any prompt file is missing.
export function loadPrompts(promptsDir: string): string[]
```

Default values for `loadSettings`:
- `runsPerModel`: 3
- `maxIterationsPerPrompt`: 5
- `stuckThreshold`: 3
- `validation.npmInstallTimeoutMs`: 120000
- `validation.buildTimeoutMs`: 120000
- `validation.devServerStartupMs`: 15000
- `validation.browserCheckTimeoutMs`: 30000
- `validation.screenshotOnFailure`: true
- `validation.screenshotOnSuccess`: false
- `reviewers`: [] (empty, warn if empty)

Required fields that throw if missing:
- Each model in `models.yaml`: `name`, `provider`, `baseUrl`, `modelId`, `apiKey`, `contextWindow`

### `harness/src/models-json.ts`

Implement three exported functions:

```typescript
import type { ModelConfig } from "./types.js";

// Converts a model name to a unique Pi provider name by slugifying it.
// Examples:
//   "Qwen3.5-122b-A10b" → "llama-qwen35-122b-a10b"
//   "gpt-oss-120b"      → "llama-gpt-oss-120b"
// Rules: lowercase, replace non-alphanumeric with hyphens, prefix with "llama-",
// collapse consecutive hyphens, strip leading/trailing hyphens from the slug part.
export function deriveProviderName(model: ModelConfig): string

// Convert an array of ModelConfig into Pi's models.json format.
// Returns both the JSON object and a providerMap (model.name → derivedProviderName).
// The providerMap is used by pi-session.ts to call modelRegistry.find(providerName, modelId).
// Each model gets its OWN provider entry to avoid Pi registry collisions.
export function generateModelsJson(models: ModelConfig[]): {
  json: object;
  providerMap: Map<string, string>;
}

// Write the models.json to outputPath and return the providerMap.
export function writeModelsJson(
  models: ModelConfig[],
  outputPath: string
): Map<string, string>
```

The generated `models.json` format must exactly match Pi's schema:

```json
{
  "providers": {
    "llama-qwen35-122b-a10b": {
      "baseUrl": "http://192.168.1.100:8080/v1",
      "api": "openai-completions",
      "apiKey": "not-needed",
      "compat": {
        "supportsDeveloperRole": false,
        "supportsReasoningEffort": false
      },
      "models": [
        {
          "id": "local-model",
          "name": "Qwen3.5-122b-A10b",
          "reasoning": false,
          "input": ["text"],
          "contextWindow": 32768,
          "maxTokens": 16384,
          "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 }
        }
      ]
    },
    "llama-gpt-oss-120b": {
      "...": "..."
    }
  }
}
```

Notes:
- `api` is always `"openai-completions"` for local llama-server models
- `input` is always `["text"]` for local models
- `cost` is always all zeros for local models
- `compat` comes directly from `model.compat` in the YAML (pass through as-is)
- `maxTokens` defaults to `16384` if not specified in YAML

**Steps:**
- [ ] Create `config/models.yaml` at the repo root with the example content above
- [ ] Create `config/settings.yaml` at the repo root with the example content above
- [ ] Implement `harness/src/config.ts` with the three loader functions
- [ ] Implement `harness/src/models-json.ts` with the three functions
- [ ] Verify: add a quick test to `harness/src/index.ts` that loads both configs, generates models.json, prints the providerMap, then exits
- [ ] Run it: `npx tsx src/index.ts` from inside `harness/` — verify the output looks correct
- [ ] Verify the generated `models.json` matches Pi's expected format by inspection
- [ ] Revert `index.ts` to just printing `"adambench harness"` after verification
- [ ] Verify `npx tsc --noEmit` still passes from inside `harness/`
- [ ] Commit with message: `"phase2: config system with YAML loading and Pi models.json generation"`

**Acceptance criteria:**
- [ ] `loadModelsConfig` parses `config/models.yaml` and returns typed `ModelConfig[]`
- [ ] `loadSettings` parses `config/settings.yaml` and fills all defaults for missing fields
- [ ] `loadPrompts` reads all 5 prompt files (`prompt1.md`–`prompt5.md`) from `prompts/` in order
- [ ] `deriveProviderName` produces unique slugified names prefixed with `"llama-"`
- [ ] `generateModelsJson` produces valid Pi `models.json` format with one provider entry per model
- [ ] `writeModelsJson` writes the file to disk and returns the providerMap
- [ ] Clear error messages thrown for missing required config fields
- [ ] TypeScript compiles without errors
