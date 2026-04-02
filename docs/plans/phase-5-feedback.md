# Phase 5: Feedback Generator

**Depends on:** [Phase 1](phase-1-scaffolding.md), [Phase 4](phase-4-validator.md)
**Next phase:** [Phase 6 — Runner](phase-6-runner.md)

---

## Task 5.1: Build symptom-based error feedback

**Context:**
When validation fails, we compose a natural-language symptom description to send back to the model as the next prompt — exactly like the human did in v1. This is critical to match v1's methodology.

The v1 policy was: describe ONLY what you observe (symptoms), never the root cause, never mention specific files or line numbers, never suggest a fix. The model is treated like a developer receiving a bug report from a non-technical user. This policy was deliberately maintained so the model has to locate and fix the issue on its own — same as in the original benchmark.

This module takes `ValidationResult[]` (from Phase 4) and returns a human-readable string ready to send as the next `sendPrompt()` call.

**Files:**
- Create: `harness/src/feedback.ts`

**What to implement:**

```typescript
import type { ValidationResult } from "./types.js";

// Compose a symptom-based feedback message from validation results.
// Returns null if all validations passed (no feedback needed).
// promptNumber is used to tailor the message (e.g. don't mention /snake before prompt 4).
export function composeFeedback(
  validationResults: ValidationResult[],
  promptNumber: number
): string | null
```

**Logic:**

1. If every `ValidationResult` has `passed: true` → return `null`
2. Collect all failures and compose a single message

**Templates by failure type:**

Build failures (`type === "build"`):
```
The project doesn't build. Here are the errors:

<build error output, max 1500 chars>
```

Browser console errors (`type === "browser"` with `consoleErrors`):
```
The app starts but there are errors in the browser console:

<list of console error messages, one per line, max 800 chars total>
```

Route/element check failures (`type === "browser"` with `errors` that are NOT console errors) — use the following specific phrasing based on which check failed (match by checking if the error string contains the route name):

| Error contains | Message to use |
|---------------|----------------|
| `/login` and "No input" | `"I navigated to /login but the page appears blank — there's no login form visible."` |
| `/dashboard` and "redirect" | `"I tried to access /dashboard without logging in, but it doesn't redirect me to the login page."` |
| `/profile` | `"The /profile page doesn't seem to have editable fields for name and email."` |
| `/snake` and ("canvas" or "game") | `"I navigated to /snake but I don't see a game. The page appears empty."` |
| `/snake` and ("rules" or "controls") | `"The snake page doesn't show any rules or controls description."` |
| other | Use the raw error string as-is |

**Combining multiple failures:**
- If there is only 1 failure → just return the message for that failure
- If there are 2+ failures:
  ```
  A few issues I noticed:

  1. <first issue message>
  2. <second issue message>
  ...
  ```
- Keep total message under 2000 chars — truncate the build error section first if needed

**Design rules (MUST follow):**
- Never mention file names (no `.tsx`, `.ts`, no `src/`, no `components/`)
- Never mention line numbers or variable names
- Never suggest a fix or hint at the cause
- Never say "you should" or "you need to"
- Tone: cooperative, brief, factual — like a user describing what they see in a browser

**Steps:**
- [ ] Implement `composeFeedback` in `harness/src/feedback.ts`
- [ ] Test with a build failure: pass a `ValidationResult` with `type: "build"`, `passed: false`, `errors: ["error TS2322: ..."]` — verify the output has the build error but no file references
- [ ] Test with browser failures: pass results with console errors and route check failures — verify correct templates are used
- [ ] Test with multiple failures: verify the numbered list format is used
- [ ] Test with all passed: verify `null` is returned
- [ ] Verify `npx tsc --noEmit` still passes from inside `harness/`
- [ ] Commit with message: `"phase5: symptom-based feedback generator"`

**Acceptance criteria:**
- [ ] Returns `null` when all `ValidationResult.passed` are true
- [ ] Returns correct template for build errors
- [ ] Returns correct template for console errors
- [ ] Returns correct specific phrasing for each route check failure
- [ ] Uses numbered list format for multiple failures
- [ ] Total message is under 2000 chars
- [ ] No file names, line numbers, variable names, or fix suggestions in output
- [ ] TypeScript compiles without errors
