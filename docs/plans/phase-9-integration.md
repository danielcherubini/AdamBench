# Phase 9: Integration Testing & Polish

**Depends on:** All previous phases
**This is the final phase.**

---

## Task 9.1: End-to-end integration test

**Context:**
Run the full pipeline end-to-end with a single model and a single run to verify all phases work together. This is a manual integration test — it requires an actual llama-server endpoint running a model. Fix any issues discovered during the run before committing.

**Files:**
- No new files. This is a testing and bug-fixing task.

**What to verify:**

**Step 1 — Benchmark:**
```bash
cd harness
npx tsx src/index.ts benchmark --model "YourTestModel" --run 1
```
Observe and verify:
- [ ] `runs/<model-name>/run-1/project/` directory is created
- [ ] `runs/<model-name>/run-1/validation/` directory is created
- [ ] All 5 prompts are sent (watch the console output)
- [ ] Validation runs after each prompt (build + browser)
- [ ] When validation fails: feedback is sent, iteration counter increments
- [ ] When stuck: stuck detection fires and moves to next prompt
- [ ] `runs/<model-name>/run-1/metrics.json` is written at the end
- [ ] `runs/<model-name>/run-1/session.jsonl` is written at the end
- [ ] `runs/<model-name>/run-1/project/status.md` is written

**Step 2 — Resume capability:**
Run the same command again:
```bash
npx tsx src/index.ts benchmark --model "YourTestModel" --run 1
```
- [ ] Output shows: `Skipping YourTestModel/run-1: already completed`
- [ ] No new LLM calls are made

**Step 3 — Status:**
```bash
npx tsx src/index.ts status
```
- [ ] Shows the model with 1 completed run, 0 reviews

**Step 4 — Review:**
```bash
npx tsx src/index.ts review --model "YourTestModel"
```
- [ ] `review_outputs_v2/<reviewer-name>/YourTestModel_run1.md` is created
- [ ] Scores are parseable from the markdown file
- [ ] `review_outputs_v2/<reviewer-name>/final_ranking.md` is created (Phase B synthesis)

**Step 5 — Score:**
```bash
npx tsx src/index.ts score
```
- [ ] `results/scores.json` is created
- [ ] JSON contains reasonable Scored, Measured, AdamBench values

**Step 6 — Report:**
```bash
npx tsx src/index.ts report
```
- [ ] `results/summary.csv` is created with correct format
- [ ] `results/summary.json` is created
- [ ] `results/per-model/YourTestModel.json` is created

**Step 7 — Session inspection:**
```bash
pi --session runs/YourTestModel/run-1/session.jsonl
```
- [ ] Pi opens and displays the session conversation without errors

**Steps:**
- [ ] Configure `config/models.yaml` with your actual llama-server endpoint and model
- [ ] Run benchmark and observe — fix any bugs found
- [ ] Verify resume capability
- [ ] Run review and verify review files
- [ ] Run score and report — verify output files
- [ ] Open session.jsonl in Pi and verify it loads
- [ ] Commit with message: `"phase9: integration test fixes and polish"`

**Acceptance criteria:**
- [ ] Full pipeline runs without crashes
- [ ] All output files (`metrics.json`, `session.jsonl`, `status.md`, review markdown, `summary.csv`, `summary.json`) are created with correct content
- [ ] Resume capability works (skips completed runs)
- [ ] Session file opens in Pi
- [ ] Review scores are in expected ranges (1–10 for categories, 1–100 for overall)

---

## Task 9.2: Add .gitignore entries and harness README

**Context:**
Generated run data, reviews, and results should not be committed to git — they can be hundreds of MB and are reproducible. The harness also needs a README so anyone can pick it up and use it.

**Files:**
- Modify: `.gitignore` (repo root)
- Create: `harness/README.md`

**What to implement:**

**Add to `.gitignore`** (at the repo root):
```
# AdamBench v2 automation outputs
harness/node_modules/
harness/dist/
harness/.bare-agent/
runs/
review_outputs_v2/
results/
```

**`harness/README.md`** — cover these sections:

1. **Overview** — what the harness does (1 paragraph)
2. **Prerequisites** — Node.js version, Pi coding agent CLI installed, API keys for reviewer models
3. **Setup**
   ```bash
   cd harness
   npm install
   npx playwright install chromium
   ```
4. **Configuration**
   - Edit `config/models.yaml` — add your local model(s) with correct llama-server URL
   - Edit `config/settings.yaml` — set runs per model, reviewer models, etc.
5. **Running the benchmark**
   ```bash
   # Validate config without running
   npx tsx src/index.ts benchmark --dry-run

   # Run all models
   npx tsx src/index.ts benchmark

   # Run a specific model
   npx tsx src/index.ts benchmark --model "Qwen3.5-122b-A10b"
   ```
6. **Running the review**
   ```bash
   npx tsx src/index.ts review
   ```
   Note: requires API keys for reviewer models (ANTHROPIC_API_KEY, OPENAI_API_KEY in environment)
7. **Scoring and reporting**
   ```bash
   npx tsx src/index.ts score
   npx tsx src/index.ts report
   # Results in results/summary.csv and results/summary.json
   ```
8. **Resuming after a crash** — explain that re-running `benchmark` skips completed runs automatically
9. **Output structure** — brief description of `runs/`, `review_outputs_v2/`, `results/`
10. **AdamBench scoring formulas** — copy the three formulas from `README.md` for reference

**Steps:**
- [ ] Add gitignore entries to the repo root `.gitignore`
- [ ] Create `harness/README.md` with all sections above
- [ ] Verify generated run data is not tracked: run `git status` — `runs/`, `review_outputs_v2/`, `results/` should not appear
- [ ] Commit with message: `"phase9: gitignore and harness documentation"`

**Acceptance criteria:**
- [ ] `git status` does not show `runs/`, `review_outputs_v2/`, or `results/` as untracked
- [ ] `harness/node_modules/`, `harness/dist/`, `harness/.bare-agent/` are ignored
- [ ] `harness/README.md` covers all 10 sections
- [ ] README is accurate about commands and configuration
