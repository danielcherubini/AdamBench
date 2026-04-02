# Phase 4: Build & Browser Validator

**Depends on:** [Phase 1](phase-1-scaffolding.md)
**Can run in parallel with:** [Phase 3](phase-3-pi-session.md)
**Next phase:** [Phase 5 — Feedback](phase-5-feedback.md), [Phase 6 — Runner](phase-6-runner.md)

---

## Task 4.1: Implement build validation

**Context:**
After each prompt, we need to check if the model's generated code actually builds. This runs `npm install` and `npm run build` in the project directory. A key challenge: models sometimes create the app in a subdirectory (e.g. `auth-app/`, `my-react-app/`, `client/`) rather than directly in the project root. This was observed in multiple v1 projects (e.g. `projects/3/auth-app/`, `projects/10/my-react-app/`, `projects/17/my-app/`, `projects/21/client/`). The validator must find the actual app root by locating `package.json`.

**Files:**
- Create: `harness/src/validator.ts` (build validation only — browser validation added in Task 4.2)

**What to implement:**

```typescript
import { execFile } from "child_process";
import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
import type { ValidationResult, ValidationSettings } from "./types.js";

// Find the directory containing package.json by searching up to 2 levels deep.
// Returns the directory path, or null if no package.json found.
// Search order: projectDir itself, then immediate subdirs, then two levels deep.
export function findAppRoot(projectDir: string): string | null

// Run npm install + npm run build in the app root.
// Returns a structured ValidationResult.
export async function validateBuild(
  appRoot: string,
  settings: ValidationSettings
): Promise<ValidationResult>
```

**`findAppRoot` implementation:**
1. If `projectDir/package.json` exists → return `projectDir`
2. List immediate subdirectories of `projectDir` (ignore `node_modules`, `.git`, `dist`)
3. For each subdir: if `subdir/package.json` exists → return `subdir`
4. For each subdir: list its subdirectories; if `subdir/subdir2/package.json` exists → return `subdir/subdir2`
5. Return `null` if nothing found

**`validateBuild` implementation:**
- Run `npm install` via `child_process.execFile("npm", ["install"], { cwd: appRoot })` with timeout `npmInstallTimeoutMs`
  - If exit code !== 0 or timeout: return `{ type: "build", passed: false, errors: ["npm install failed:\n" + truncate(stderr, 2000)], timestamp: Date.now() }`
- Run `npm run build` via `child_process.execFile("npm", ["run", "build"], { cwd: appRoot })` with timeout `buildTimeoutMs`
  - Capture both stdout and stderr
  - If exit code !== 0 or timeout: return `{ type: "build", passed: false, errors: [truncate(stderr + stdout, 2000)], timestamp: Date.now() }`
  - If success: return `{ type: "build", passed: true, errors: [], timestamp: Date.now() }`
- Helper: `truncate(s, maxLen)` — if `s.length > maxLen`, return `s.slice(0, maxLen) + "\n...(truncated)"`

Use `Promise` wrapping of `execFile` with a `setTimeout` race for timeouts.

**Steps:**
- [ ] Implement `findAppRoot` and `validateBuild` in `harness/src/validator.ts`
- [ ] Test `findAppRoot` against existing v1 projects:
  - `projects/1/` — flat structure, should return `projects/1/`
  - `projects/3/` — nested at `projects/3/auth-app/`, should return that path
  - `projects/10/` — nested at `projects/10/my-react-app/`, should return that path
- [ ] Test `validateBuild` against `projects/16/` (known good project — should pass)
- [ ] Verify timeout enforcement: set `buildTimeoutMs: 100` and confirm it returns an error quickly
- [ ] Verify `npx tsc --noEmit` still passes from inside `harness/`
- [ ] Commit with message: `"phase4: build validation with app root detection"`

**Acceptance criteria:**
- [ ] `findAppRoot` finds `package.json` in flat and nested structures (up to 2 levels deep)
- [ ] `findAppRoot` ignores `node_modules/`, `.git/`, `dist/`
- [ ] `validateBuild` runs `npm install` then `npm run build` in sequence
- [ ] Errors are captured and truncated to 2000 chars
- [ ] Timeouts are enforced and return `passed: false`
- [ ] TypeScript compiles without errors

---

## Task 4.2: Implement browser validation with Playwright

**Context:**
After a successful build, we start the dev server and use Playwright to check that pages render correctly, expected elements exist, and there are no console errors. This is an **element-check approach** (NOT full interaction) — we verify that forms, canvases, and route structures exist. We do NOT fill in forms or click buttons.

The checks are **prompt-stage-aware**: which routes to check depends on how many prompts have been completed. After prompt 1 we only check login + dashboard redirect. After prompt 3 we also check profile. After prompt 4 we also check snake. Prompt 5 (simplification) should pass the same checks as prompt 4.

**Files:**
- Modify: `harness/src/validator.ts` (add browser validation functions)
- Create: `harness/playwright.config.ts`

**What to implement:**

Add to `harness/src/validator.ts`:

```typescript
import { chromium } from "playwright";

// Start dev server, run Playwright checks, kill dev server.
// completedPrompts: how many benchmark prompts have been sent so far (1–5)
// screenshotDir: absolute path where screenshots are saved on failure
async function validateBrowser(
  appRoot: string,
  completedPrompts: number,
  screenshotDir: string,
  settings: ValidationSettings
): Promise<ValidationResult>

// Top-level orchestrator: run build validation, then browser validation if build passes.
// Returns an array (one ValidationResult per phase run).
export async function validateProject(
  projectDir: string,
  completedPrompts: number,
  screenshotDir: string,
  settings: ValidationSettings
): Promise<ValidationResult[]>
```

**`validateBrowser` implementation:**

**Step 1 — Detect dev server command:**
Read `appRoot/package.json`, look at `scripts`:
- If `"dev"` exists → `npm run dev`
- Else if `"start"` exists → `npm run start`
- Else → `npx vite` (fallback)

**Step 2 — Detect port:**
- Check common ports in order: 5173 (Vite default), 3000 (CRA default), 3001, 8080
- Parse the dev server's stdout for patterns like `"localhost:XXXX"` or `"Local: http://localhost:XXXX"`
- Before starting the server, verify the chosen port is not already in use

**Step 3 — Start dev server:**
```typescript
const serverProcess = spawn("npm", ["run", "dev"], {
  cwd: appRoot,
  detached: true,  // so we can kill the whole process group
});
```
Wait up to `devServerStartupMs` by polling `http://localhost:<port>` every 500ms.
If the server doesn't start in time, kill it and return `passed: false`.

**Step 4 — Run Playwright checks:**

Create a browser and page:
```typescript
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
```

Capture console errors and page errors:
```typescript
const consoleErrors: string[] = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push(err.message));
```

Checks by prompt stage (cumulative — later stages include all earlier checks):

**After prompt 1 or 2:**
- Navigate to `/` — check page has content (body is not empty, document.body.innerText.trim().length > 0)
- Navigate to `/login` — check at least one `<input>` element and one `<button>` element exist
- Navigate to `/dashboard` — check the final URL includes `/login` (protected route redirects unauthenticated users)

**After prompt 3 (also check):**
- Navigate to `/profile` — check at least two `<input>` elements exist (name + email fields)

**After prompt 4 or 5 (also check):**
- Navigate to `/snake` — check either a `<canvas>` element OR a div with id/class containing "snake" or "game" exists
- On the `/snake` page — check that `document.body.innerText` contains at least one of: "rules", "controls", "how to play", "wasd", "arrow" (case-insensitive)

For each check that fails, add a human-readable description to the `errors` array (e.g. `"No input elements found on /login"`, `"Dashboard did not redirect to /login"`).

Take a screenshot if `screenshotOnFailure` is true and any check failed, or if `screenshotOnSuccess` is true regardless:
```typescript
await page.screenshot({ path: join(screenshotDir, `${routeName}.png`) });
```

**Step 5 — Kill dev server:**

Always in a `finally` block:
```typescript
import kill from "tree-kill";
kill(serverProcess.pid);
await browser.close();
```

**Return:**
```typescript
return {
  type: "browser",
  passed: errors.length === 0 && consoleErrors.length === 0,
  errors: [...checkErrors, ...consoleErrors],
  screenshots: screenshotPaths,
  consoleErrors,
  timestamp: Date.now(),
};
```

**`validateProject` implementation:**
```typescript
export async function validateProject(
  projectDir: string,
  completedPrompts: number,
  screenshotDir: string,
  settings: ValidationSettings
): Promise<ValidationResult[]> {
  const appRoot = findAppRoot(projectDir);
  if (!appRoot) {
    return [{
      type: "build",
      passed: false,
      errors: ["No package.json found in project directory or subdirectories"],
      timestamp: Date.now(),
    }];
  }

  const buildResult = await validateBuild(appRoot, settings);
  if (!buildResult.passed) return [buildResult];

  const browserResult = await validateBrowser(appRoot, completedPrompts, screenshotDir, settings);
  return [buildResult, browserResult];
}
```

**`harness/playwright.config.ts`:**
```typescript
import { defineConfig } from "@playwright/test";
export default defineConfig({
  use: {
    headless: true,
    browserName: "chromium",
  },
});
```
This file is for reference only — we use Playwright's API directly, not the test runner.

**Steps:**
- [ ] Add browser validation to `harness/src/validator.ts`
- [ ] Create `harness/playwright.config.ts`
- [ ] Test `validateProject` against `projects/16/` (known good, should pass all checks after simulating 5 prompts completed)
- [ ] Test against `projects/7/` (known broken — should detect errors)
- [ ] Verify screenshots are saved to `screenshotDir` when checks fail
- [ ] Verify dev server process is killed even when checks throw an exception (finally block works)
- [ ] Verify `npx tsc --noEmit` still passes from inside `harness/`
- [ ] Commit with message: `"phase4: Playwright browser validation with prompt-stage-aware checks"`

**Acceptance criteria:**
- [ ] Dev server starts, checks run, dev server stops cleanly every time
- [ ] Port detection works for Vite (5173) and CRA (3000) projects
- [ ] Route checks are correct per prompt stage (cumulative)
- [ ] Console errors are captured
- [ ] Screenshots saved to `screenshotDir` on failure when configured
- [ ] No zombie processes — dev server always killed in finally block
- [ ] `validateProject` returns build result only (no browser check) if build fails
- [ ] TypeScript compiles without errors
