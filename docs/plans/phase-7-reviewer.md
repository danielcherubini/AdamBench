# Phase 7: Automated Review System

**Task 7.1 depends on:** [Phase 1](phase-1-scaffolding.md)
**Task 7.2 depends on:** [Phase 1](phase-1-scaffolding.md), [Phase 2](phase-2-config.md), [Phase 6](phase-6-runner.md)
**Task 7.1 can run in parallel with:** Phases 3–5
**Next phase:** [Phase 8 — Scoring & Reporting](phase-8-scoring-reporting.md)

---

## Task 7.1: Score parsing and status.md generation (pure functions)

**Context:**
These are pure utility functions with no LLM calls — implement and test them first. They will be used by the reviewer orchestration (Task 7.2) and the runner (Phase 6).

`parseReviewScores` parses structured markdown output from reviewer models into typed scores. The regex patterns must match the exact format from v1 reviews (found in `review_outputs/GPT/`, `review_outputs/Sonnet/`, `review_outputs/GLM/`). Scores appear as list items like `- Task completion: 8/10` and the overall score as `Overall score: 82/100`.

`generateStatusMd` produces the `status.md` file that the reviewer reads first when reviewing a project. The runner (Phase 6) calls this after each completed run.

**Files:**
- Create: `harness/src/reviewer.ts` (pure functions only — orchestration added in Task 7.2)

**What to implement:**

```typescript
import type { RunMetrics, ReviewScores } from "./types.js";

// Parse scores from structured reviewer markdown output.
// Returns null if any required score cannot be parsed — log a warning but don't throw.
export function parseReviewScores(markdown: string): ReviewScores | null

// Generate status.md content from run metrics.
// This is called by the RUNNER after each run, not by the reviewer.
// The reviewer reads this file first when reviewing a project.
export function generateStatusMd(metrics: RunMetrics): string
```

**`parseReviewScores` implementation:**

Use case-insensitive regex. Allow markdown formatting (bold, list items, extra spaces). Try both `X/10` and `X / 10` formats.

```typescript
function extractScore(markdown: string, pattern: RegExp): number | null {
  const match = markdown.match(pattern);
  return match ? parseInt(match[1], 10) : null;
}

const patterns = {
  taskCompletion:              /task\s+completion[:\s*]+(\d+)\s*\/\s*10/i,
  correctness:                 /correctness[:\s*]+(\d+)\s*\/\s*10/i,
  codeQuality:                 /code\s+quality[:\s*]+(\d+)\s*\/\s*10/i,
  architectureMaintainability: /architecture\s*[\/&,]\s*maintainability[:\s*]+(\d+)\s*\/\s*10/i,
  simplicityVsOverengineering: /simplicity\s*vs\.?\s*(over)?engineer\w+[:\s*]+(\d+)\s*\/\s*10/i,
  overallProjectQuality:       /overall\s+project\s+quality[:\s*]+(\d+)\s*\/\s*10/i,
  overallScore:                /overall\s+score[:\s*]+(\d+)\s*\/\s*100/i,
};
```

Note: `simplicityVsOverengineering` captures group 2 (the score), not group 1.

For the `comment` field: extract the content of the `## Summary` section (text between `## Summary` and the next `##` heading, trimmed). If no Summary section, use the first paragraph after `## Final verdict`.

If ANY of the 7 required numeric scores is null, log:
```
[WARNING] Could not parse score '<field name>' from review output. Raw markdown saved but scores not recorded.
```
and return `null`.

**`generateStatusMd` implementation:**

```typescript
export function generateStatusMd(metrics: RunMetrics): string {
  const completed = metrics.completedTasks === 5;
  const firstFailed = metrics.prompts.find((p) => !p.completed);
  const failedStr = firstFailed
    ? `on prompt ${firstFailed.promptNumber} -> ${firstFailed.failureReason ?? "unknown"}`
    : "null";

  return [
    `completed: ${completed}`,
    `failed: ${failedStr}`,
    `completed_tasks: ${metrics.completedTasks}`,
    `total_iterations: ${metrics.totalIterations}`,
  ].join("\n") + "\n";
}
```

**Steps:**
- [ ] Create `harness/src/reviewer.ts` with `parseReviewScores` and `generateStatusMd`
- [ ] Test `parseReviewScores` against real v1 review files — read several from `review_outputs/GPT/` and `review_outputs/Sonnet/` and verify all 7 scores parse correctly
  - Run: `node -e "import('./src/reviewer.js').then(m => console.log(m.parseReviewScores(require('fs').readFileSync('../review_outputs/GPT/project_01.md', 'utf8'))))"`
  - Adjust for ESM as needed
- [ ] Test `generateStatusMd` with a mock `RunMetrics` object — verify output matches v1 `status.md` format
- [ ] Test `parseReviewScores` with malformed markdown — verify it returns `null` and logs a warning
- [ ] Verify `npx tsc --noEmit` passes from inside `harness/`
- [ ] Commit with message: `"phase7: review score parsing and status.md generation"`

**Acceptance criteria:**
- [ ] `parseReviewScores` correctly parses all 7 score fields from v1 review markdown format
- [ ] Handles formatting variations: bold (`**X/10**`), list items (`- X/10`), extra whitespace
- [ ] Returns `null` and logs a warning if any score is missing
- [ ] `generateStatusMd` output matches v1 format (`completed: true/false`, `failed: null/...`, etc.)
- [ ] TypeScript compiles without errors

---

## Task 7.2: Reviewer session orchestration

**Context:**
After benchmark runs complete, the review phase sends each generated project to API reviewer models (Sonnet4.6, GPT-5.4, etc.) for scoring, replacing the manual v1 review process.

The review has TWO phases, matching v1 exactly:
- **Phase A:** Individual project reviews — batched 5 projects per Pi session to avoid context rot (same as v1 methodology)
- **Phase B:** Synthesis — a new session where the reviewer reads all its own Phase A reviews and produces `final_ranking.md` with an adjusted consistent ranking

Each reviewer Pi session uses **read-only tools** pointed at the repo root so the reviewer can read `prompts/`, `runs/<model>/run-<N>/project/`, and `status.md`. The reviewer's Pi session is a separate fresh session for each batch — it does NOT share a session with the benchmark runner.

**Important SDK notes:**
- For reviewer sessions using built-in API models (Anthropic, OpenAI): use `getModel(provider, modelId)` from `@mariozechner/pi-ai`
- Use `createReadOnlyTools(repoRoot)` for the `tools` parameter to `createAgentSession()` — this gives the reviewer read/grep/find/ls tools all pointed at `repoRoot`
- Use `SessionManager.inMemory()` — reviewer sessions don't need persistence

**Files:**
- Modify: `harness/src/reviewer.ts` (add class and orchestration)

**What to implement:**

```typescript
import path from "path";
import { mkdirSync, writeFileSync, existsSync } from "fs";
import {
  createAgentSession,
  AuthStorage,
  ModelRegistry,
  SessionManager,
  SettingsManager,
  DefaultResourceLoader,
  createReadOnlyTools,
} from "@mariozechner/pi-coding-agent";
import { getModel } from "@mariozechner/pi-ai";
import type { ReviewerConfig, ReviewResult, RunMetrics, BenchmarkSettings } from "./types.js";
import { parseReviewScores } from "./reviewer.js"; // same file, referenced for clarity

export class AutomatedReviewer {
  constructor(
    private reviewerConfigs: ReviewerConfig[],
    private settings: BenchmarkSettings,
    private bareAgentDir: string,     // empty dir (no models.json needed — API models are built-in)
    private repoRoot: string          // absolute path to AdamBench repo root
  )

  // Run Phase A + Phase B for all reviewer configs.
  // runResults maps model name → array of RunMetrics (one per run).
  async reviewAll(
    runResults: Map<string, RunMetrics[]>
  ): Promise<ReviewResult[]>

  // Phase A: review individual projects in batches of 5 per session.
  async reviewProjects(
    reviewer: ReviewerConfig,
    projects: Array<{ projectDir: string; modelName: string; runNumber: number }>
  ): Promise<ReviewResult[]>

  // Phase B: synthesis session — reviewer reads all its Phase A outputs and produces final_ranking.md.
  async synthesizeReviews(
    reviewer: ReviewerConfig,
    reviewerOutputDir: string  // e.g. review_outputs_v2/Sonnet4.6/
  ): Promise<void>
}
```

### `reviewAll()` implementation

```typescript
async reviewAll(runResults: Map<string, RunMetrics[]>): Promise<ReviewResult[]> {
  // Build flat list of projects to review
  const projects: Array<{ projectDir: string; modelName: string; runNumber: number }> = [];
  for (const [modelName, runs] of runResults) {
    for (const run of runs) {
      projects.push({
        projectDir: path.join(this.settings.outputDir, modelName, `run-${run.runNumber}`, "project"),
        modelName,
        runNumber: run.runNumber,
      });
    }
  }

  const allResults: ReviewResult[] = [];
  for (const reviewer of this.reviewerConfigs) {
    console.log(`[Reviewer: ${reviewer.name}] Starting Phase A (${projects.length} projects)...`);
    const results = await this.reviewProjects(reviewer, projects);
    allResults.push(...results);

    const reviewerOutputDir = path.join(this.settings.reviewOutputDir, reviewer.name);
    console.log(`[Reviewer: ${reviewer.name}] Starting Phase B synthesis...`);
    await this.synthesizeReviews(reviewer, reviewerOutputDir);
  }
  return allResults;
}
```

### `reviewProjects()` implementation (Phase A)

Process projects in batches of 5. For each batch, create a new Pi session, send the setup prompt, then send one review prompt per project:

```typescript
const BATCH_SIZE = 5;
const results: ReviewResult[] = [];

for (let i = 0; i < projects.length; i += BATCH_SIZE) {
  const batch = projects.slice(i, i + BATCH_SIZE);

  // Create a new reviewer session for this batch
  const session = await this.createReviewerSession(reviewer);

  // Send Phase A setup prompt (from reviewerPrompts.md, adapted)
  await session.prompt(this.getPhaseASetupPrompt());

  // Review each project in the batch
  for (const project of batch) {
    console.log(`[Reviewer: ${reviewer.name}] Reviewing ${project.modelName} run-${project.runNumber}...`);

    const reviewPrompt = `Now review the project at \`${project.projectDir}\`.\n\nRemember:\n- inspect only this project\n- read status.md first\n- inspect the required source files deeply enough to verify the benchmark tasks\n- do not rely only on file tree listing\n- output your full structured review in the format specified`;

    await session.prompt(reviewPrompt);

    // Extract the last assistant message text
    const markdown = this.extractLastAssistantText(session);

    // Save raw markdown
    const reviewerOutputDir = path.join(this.settings.reviewOutputDir, reviewer.name);
    mkdirSync(reviewerOutputDir, { recursive: true });
    const outFile = path.join(reviewerOutputDir, `${project.modelName}_run${project.runNumber}.md`);
    writeFileSync(outFile, markdown);

    // Parse scores
    const scores = parseReviewScores(markdown);
    if (scores) {
      results.push({
        reviewer: reviewer.name,
        model: project.modelName,
        runNumber: project.runNumber,
        scores,
        rawMarkdown: markdown,
      });
    } else {
      console.warn(`[Reviewer: ${reviewer.name}] Could not parse scores for ${project.modelName} run-${project.runNumber}`);
    }
  }

  await session.dispose?.();
}

return results;
```

### `createReviewerSession()` helper

```typescript
private async createReviewerSession(reviewer: ReviewerConfig) {
  const model = getModel(reviewer.provider, reviewer.modelId);
  if (!model) throw new Error(`Reviewer model not found: ${reviewer.provider}/${reviewer.modelId}`);

  const authStorage = AuthStorage.create();
  const modelRegistry = ModelRegistry.create(authStorage);
  const tools = createReadOnlyTools(this.repoRoot);  // read-only tools for repo root

  const loader = new DefaultResourceLoader({
    cwd: this.repoRoot,
    agentDir: this.bareAgentDir,
  });
  await loader.reload();

  const { session } = await createAgentSession({
    cwd: this.repoRoot,
    model,
    thinkingLevel: "off",
    tools,
    authStorage,
    modelRegistry,
    resourceLoader: loader,
    sessionManager: SessionManager.inMemory(),
    settingsManager: SettingsManager.inMemory(),
  });

  return session;
}
```

### Phase A setup prompt (`getPhaseASetupPrompt()`)

Adapt the prompt from `review_outputs/reviewerPrompts.md` (lines 4–186). Key changes for automation:
- Change "save the review to `review_outputs/GLM/project_XX.md`" → "output the full review in your response (do not save to disk)"
- Keep all scoring rubric, inspection requirements, and output format requirements identical to v1

### `synthesizeReviews()` implementation (Phase B)

```typescript
async synthesizeReviews(reviewer: ReviewerConfig, reviewerOutputDir: string): Promise<void> {
  const session = await this.createReviewerSession(reviewer);

  // Synthesis prompt from reviewerPrompts.md (lines 211–386), adapted:
  // Change save path to "output in your response"
  const synthesisPrompt = this.getSynthesisPrompt(reviewerOutputDir);

  await session.prompt(synthesisPrompt);

  const markdown = this.extractLastAssistantText(session);
  const outFile = path.join(reviewerOutputDir, "final_ranking.md");
  writeFileSync(outFile, markdown);
  console.log(`[Reviewer: ${reviewer.name}] Synthesis saved to ${outFile}`);

  await session.dispose?.();
}
```

### `extractLastAssistantText()` helper

```typescript
private extractLastAssistantText(session: any): string {
  const messages = session.state?.messages ?? [];
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === "assistant") {
      return msg.content
        .filter((c: any) => c.type === "text")
        .map((c: any) => c.text)
        .join("\n");
    }
  }
  return "";
}
```

**Steps:**
- [ ] Add `AutomatedReviewer` class to `harness/src/reviewer.ts`
- [ ] Copy Phase A setup prompt from `review_outputs/reviewerPrompts.md` (lines 4–186) and adapt for automation
- [ ] Copy synthesis prompt from `review_outputs/reviewerPrompts.md` (lines 211–386) and adapt for automation
- [ ] Test: run `reviewProjects` with one reviewer against one existing v1 project (e.g. `projects/16/`)
  - Verify a markdown file is saved to `review_outputs_v2/<reviewer>/`
  - Verify scores are parsed correctly
- [ ] Test: run `synthesizeReviews` on the output of the above
  - Verify `final_ranking.md` is saved
- [ ] Verify read-only tools are used (reviewer should not be able to write files to `projects/`)
- [ ] Verify session is disposed after each batch
- [ ] Verify `npx tsc --noEmit` passes from inside `harness/`
- [ ] Commit with message: `"phase7: reviewer orchestration with Phase A batching and Phase B synthesis"`

**Acceptance criteria:**
- [ ] Reviewer sessions use `createReadOnlyTools(repoRoot)` via `tools` param
- [ ] Reviewer prompts match v1 format (Phase A setup + per-project + Phase B synthesis)
- [ ] Phase A processes projects in batches of 5 — new session per batch
- [ ] Individual review markdown files saved to `review_outputs_v2/<reviewer>/<model>_run<N>.md`
- [ ] Scores parsed via `parseReviewScores()` — skipped gracefully if unparseable
- [ ] Phase B synthesis produces `review_outputs_v2/<reviewer>/final_ranking.md`
- [ ] All sessions disposed after use
- [ ] TypeScript compiles without errors
