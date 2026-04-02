# AdamBench v2 Automation Plan — Index

**Goal:** Automate the entire AdamBench pipeline — benchmark execution via Pi SDK against local llama-server models, automated build + browser validation with symptom-based error feedback, multi-run support, and automated reviewer scoring via API models.

**Architecture:** A TypeScript Node.js harness (`harness/`) in this repo that orchestrates Pi coding agent sessions via SDK, validates outputs with `npm run build` + Playwright headless browser checks, feeds symptom-only errors back to the model automatically (matching v1 manual policy), collects all v1 metrics (tokens, iterations, time, TPS), then runs the review phase programmatically via API reviewer models.

**Tech Stack:** TypeScript (tsx), `@mariozechner/pi-coding-agent` SDK, Playwright (headless Chromium), `commander` (CLI), `yaml` (config parsing)

---

## Directory Structure (final state)

```
AdamBench/
├── harness/                        # NEW — automation harness
│   ├── package.json
│   ├── tsconfig.json
│   ├── playwright.config.ts
│   └── src/
│       ├── index.ts                # CLI entry point (commander)
│       ├── types.ts                # All shared TypeScript types
│       ├── config.ts               # Load & validate YAML configs
│       ├── models-json.ts          # Generate Pi models.json from config
│       ├── pi-session.ts           # Pi SDK wrapper for benchmark sessions
│       ├── validator.ts            # Build + Playwright browser checks
│       ├── feedback.ts             # Error → symptom-description translator
│       ├── runner.ts               # Main benchmark orchestrator
│       ├── reviewer.ts             # Automated review via API models
│       ├── metrics.ts              # Scoring formulas (Scored, Measured, AdamBench)
│       └── reporter.ts             # Aggregate results → CSV/JSON
├── config/                         # NEW — benchmark configuration
│   ├── models.yaml                 # Model definitions with compat overrides
│   └── settings.yaml               # Benchmark settings (runs, timeouts, etc.)
├── runs/                           # NEW — v2 automated run outputs
│   └── <model-name>/
│       └── run-<N>/
│           ├── project/            # The generated React app
│           ├── session.jsonl       # Pi session log
│           ├── metrics.json        # Per-run metrics
│           └── validation/         # Build logs, screenshots, console logs
├── review_outputs_v2/              # NEW — automated reviewer outputs
│   └── <reviewer-model>/
│       └── <model-name>_run<N>.md
├── results/                        # NEW — aggregated scoring
│   ├── summary.csv
│   ├── summary.json
│   └── per-model/
│       └── <model-name>.json
├── prompts/                        # EXISTING — unchanged
├── projects/                       # EXISTING — v1 projects, unchanged
├── review_outputs/                 # EXISTING — v1 reviews, unchanged
└── visualisations/                 # EXISTING — unchanged
```

---

## Phases

| Phase | File | Tasks | Depends On |
|-------|------|-------|------------|
| **Phase 1** | [phase-1-scaffolding.md](phase-1-scaffolding.md) | 1.1 Scaffolding, 1.2 Types | Nothing |
| **Phase 2** | [phase-2-config.md](phase-2-config.md) | 2.1 Config + models.json | Phase 1 |
| **Phase 3** | [phase-3-pi-session.md](phase-3-pi-session.md) | 3.1 Pi SDK session wrapper | Phase 1, 2 |
| **Phase 4** | [phase-4-validator.md](phase-4-validator.md) | 4.1 Build validation, 4.2 Browser validation | Phase 1 |
| **Phase 5** | [phase-5-feedback.md](phase-5-feedback.md) | 5.1 Feedback generator | Phase 1, 4 |
| **Phase 6** | [phase-6-runner.md](phase-6-runner.md) | 6.1 Main runner orchestrator | Phase 2, 3, 4, 5 |
| **Phase 7** | [phase-7-reviewer.md](phase-7-reviewer.md) | 7.1 Score parsing + status.md, 7.2 Reviewer orchestration | Phase 1 / Phase 1, 2, 6 |
| **Phase 8** | [phase-8-scoring-reporting.md](phase-8-scoring-reporting.md) | 8.1 Scoring formulas, 8.2 Reporter + CLI | Phase 1, 2, 6, 7 |
| **Phase 9** | [phase-9-integration.md](phase-9-integration.md) | 9.1 Integration test, 9.2 Gitignore + docs | All above |

Phases 3 and 4 can be developed in parallel.
Phase 7.1 (pure functions) can be developed in parallel with Phases 3–5.

---

## Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Models create deeply nested project structures | Validator can't find app root | Medium | `findAppRoot` searches 2 levels deep; log warning if not found |
| Dev server uses non-standard port | Browser checks connect to wrong port | Medium | Parse stdout for port; try common ports as fallback |
| Dev server port already in use (zombie from previous run) | Validation fails to start | Medium | Check port availability before starting; use `tree-kill`; consider random ports |
| Playwright checks are flaky across different React app structures | False negatives/positives | High | Keep checks loose (element existence, not exact selectors); retry once |
| Pi SDK API changes between versions | Build breaks | Low | Pin exact version in package.json |
| Long sessions trigger compaction, losing early context | Model loses track of what it built | Medium | Log when compaction triggers; correlate with results |
| Reviewer model output doesn't match expected score format | Score parsing fails | Medium | Log warning, save raw markdown, skip unparseable reviews |
| Dev server zombie processes accumulate | System resource exhaustion | Medium | tree-kill, process group killing, cleanup on error, finally blocks |
| llama-server is slow and runs take hours | Benchmark takes days for multiple models × runs | High | Resume capability skips completed runs; log progress clearly |
| Model hangs or generates endlessly | Harness stuck forever | Medium | Per-prompt timeout (configurable, default 30 minutes) |
| Crash mid-benchmark loses progress | Must re-run all completed work | Medium | Resume capability: skip runs with existing metrics.json |
| TPS estimation inaccurate (includes tool execution time) | AdamBench score is wrong | Medium | Track generation time separately (turn_start to message_end only) |
| User forgets to swap llama-server model | Wrong model benchmarked | Medium | Pause between models with clear prompt; optional health check |

---

## Reviewer Notes

This plan was reviewed and revised to address:
- Pi SDK `DefaultResourceLoader` does not accept override callbacks — use empty agentDir instead
- Token usage must be accumulated across multiple `turn_end` events per prompt (not just last turn)
- `sendPrompt()` takes `promptNumber` and `iteration` as parameters (harness-level concepts, not from Pi events)
- Reviewer tool factories must use `createReadOnlyTools(cwd)` for custom cwd, passed via `tools` param to `createAgentSession()`
- Reviewer model resolution uses `getModel()` from `@mariozechner/pi-ai` for built-in API models
- Provider name mapping: `models-json.ts` returns a `providerMap` (model name → derived provider name) used by `pi-session.ts` for `modelRegistry.find()`
- Added Phase B synthesis (final_ranking.md) to match v1 two-phase review methodology
- Added model swap pause, resume capability, per-prompt timeout, and generation-only TPS estimation
- `generateStatusMd()` is defined in `reviewer.ts` but called by the runner after each run completes
- Split Phase 7 into 7.1 (pure functions, no deps beyond types) and 7.2 (orchestration, needs Phase 6)
