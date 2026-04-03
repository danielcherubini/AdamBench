# AdamBench v2 Automation Harness

## Overview

AdamBench v2 is an automated benchmark harness for evaluating AI coding agents. It automates the entire benchmarking workflow: running benchmark prompts, validating generated code, generating symptom-based feedback, running automated reviews, and calculating final scores. The harness ties together all phases of the benchmark process into a unified CLI tool.

## Prerequisites

- **Node.js** 18+ installed
- **Pi Coding Agent CLI** installed: `npm install -g @mariozechner/pi-coding-agent`
- **API keys** for reviewer models (Anthropic, OpenAI) — see `config/settings.yaml`
- **Playwright** for browser validation: `npx playwright install chromium`

## Setup

```bash
cd harness
npm install
npx playwright install chromium
```

## Configuration

### Edit `config/models.yaml`

Add your local model(s) with correct llama-server URL:

```yaml
- name: Qwen3.5-122b-A10b
  provider: llama-server
  baseUrl: http://localhost:8080/v1
  modelId: local-model
  apiKey: not-needed
  contextWindow: 32768
```

### Edit `config/settings.yaml`

Set runs per model, reviewer models, etc.:

```yaml
runsPerModel: 3
maxIterationsPerPrompt: 5
stuckThreshold: 3
promptsDir: ../prompts
outputDir: ../runs
reviewOutputDir: ../review_outputs_v2
resultsDir: ../results
```

## Running the Benchmark

### Validate config without running

```bash
npx tsx src/index.ts benchmark --dry-run
```

### Run all models

```bash
npx tsx src/index.ts benchmark
```

### Run a specific model

```bash
npx tsx src/index.ts benchmark --model "Qwen3.5-122b-A10b"
```

## Running the Review

```bash
npx tsx src/index.ts review
```

**Note**: Requires API keys for reviewer models (ANTHROPIC_API_KEY, OPENAI_API_KEY in environment).

## Scoring and Reporting

```bash
npx tsx src/index.ts score
npx tsx src/index.ts report
# Results in results/summary.csv and results/summary.json
```

## Resuming After a Crash

Re-running `benchmark` automatically skips completed runs. The harness checks for existing `metrics.json` files and continues from where it left off.

## Output Structure

- **`runs/`** — Generated project directories for each model/run
- **`review_outputs_v2/`** — Reviewer markdown files and final rankings
- **`results/`** — Scored results, CSV summaries, JSON reports

## AdamBench Scoring Formulas

The AdamBench scoring system uses three metrics:

1. **Scored**: Average of reviewer overall scores (1–100)
2. **Measured**: Quality score adjusted for completion and iterations
3. **AdamBench**: Measured score adjusted for generation time

The formulas are implemented in `harness/src/metrics.ts` and match the v1 benchmark exactly.

## CLI Commands

| Command | Description |
|---------|-------------|
| `benchmark` | Run benchmark on all models |
| `benchmark --model <name>` | Run benchmark on specific model |
| `benchmark --dry-run` | Validate config without running |
| `review` | Run automated review on completed runs |
| `score` | Calculate scores from existing metrics |
| `report` | Generate CSV/JSON reports |
| `status` | Show status of all models |

## See Also

- [Phase 1](../docs/plans/phase-1-scaffolding.md) — Scaffolding
- [Phase 2](../docs/plans/phase-2-config.md) — Config loading
- [Phase 3](../docs/plans/phase-3-pi-session.md) — Pi session wrapper
- [Phase 4](../docs/plans/phase-4-validator.md) — Build & browser validation
- [Phase 5](../docs/plans/phase-5-feedback.md) — Feedback generator
- [Phase 6](../docs/plans/phase-6-runner.md) — Main benchmark runner
- [Phase 7](../docs/plans/phase-7-reviewer.md) — Automated review system
- [Phase 8](../docs/plans/phase-8-scoring-reporting.md) — Scoring & reporting
