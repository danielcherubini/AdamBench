# Phase 5 Implementation Plan: Feedback Generator

## Overview
Create `harness/src/feedback.ts` with the `composeFeedback` function that generates symptom-based error feedback from validation results.

## Files to Create
- `harness/src/feedback.ts` - New file with `composeFeedback` function

## Dependencies
- `harness/src/types.ts` - Already exists with `ValidationResult` interface

## Implementation Details

### Function Signature
```typescript
export function composeFeedback(
  validationResults: ValidationResult[],
  promptNumber: number
): string | null
```

### Logic Flow

1. **Check for success**: If all `ValidationResult.passed === true`, return `null`
2. **Collect failures**: Filter validation results where `passed === false`
3. **Generate messages**: Convert each failure to a symptom-based message using templates
4. **Combine messages**: Format multiple failures as a numbered list
5. **Truncate if needed**: Ensure total message < 2000 characters

### Templates by Failure Type

#### Build Failures (`type === "build"`)
```
The project doesn't build. Here are the errors:

<build error output, max 1500 chars>
```

#### Browser Console Errors (`type === "browser"` with `consoleErrors`)
```
The app starts but there are errors in the browser console:

<list of console error messages, one per line, max 800 chars total>
```

#### Route Check Failures (`type === "browser"` with `errors`)

Use specific phrasing based on error content:

| Error contains | Message Template |
|---------------|------------------|
| `/login` and "No input" | `"I navigated to /login but the page appears blank — there's no login form visible."` |
| `/dashboard` and "redirect" | `"I tried to access /dashboard without logging in, but it doesn't redirect me to the login page."` |
| `/profile` | `"The /profile page doesn't seem to have editable fields for name and email."` |
| `/snake` and ("canvas" or "game") | `"I navigated to /snake but I don't see a game. The page appears empty."` |
| `/snake` and ("rules" or "controls") | `"The snake page doesn't show any rules or controls description."` |
| other | Use raw error string |

### Combination Rules

- **Single failure**: Return the message directly
- **Multiple failures**: Use numbered list format:
  ```
  A few issues I noticed:

  1. <first issue message>
  2. <second issue message>
  ...
  ```

### Design Rules (MUST FOLLOW)

- ✅ Never mention file names (no `.tsx`, `.ts`, no paths)
- ✅ Never mention line numbers or variable names
- ✅ Never suggest a fix or hint at the cause
- ✅ Never say "you should" or "you need to"
- ✅ Tone: cooperative, brief, factual — like a user describing what they see
- ✅ Total message < 2000 characters
- ✅ Truncate build error section first if truncation needed

## Implementation Steps

### Step 1: Create the file
Create `harness/src/feedback.ts` with the function implementation.

### Step 2: Implement helper functions
- `generateBuildErrorMessage(validationResult: ValidationResult): string`
- `generateConsoleErrorMessage(validationResult: ValidationResult): string`
- `generateRouteCheckMessage(validationResult: ValidationResult): string`
- `truncateMessage(text: string, maxChars: number): string`

### Step 3: Implement main function
Implement `composeFeedback` with:
- Success check (return null if all passed)
- Failure message generation
- Message combination logic
- Truncation logic

### Step 4: Test
Test with:
- Build failure
- Browser console errors
- Route check failures
- Multiple failures
- All passed scenario

### Step 5: Verify
Run `npx tsc --noEmit` from `harness/` directory

## Code Structure

```typescript
import type { ValidationResult } from "./types.js";

// Helper: Generate build error message
function generateBuildErrorMessage(result: ValidationResult): string {
  // Template: "The project doesn't build. Here are the errors:\n\n<errors>"
  // Truncate errors to max 1500 chars
  // Return formatted string
}

// Helper: Generate console error message
function generateConsoleErrorMessage(result: ValidationResult): string {
  // Template: "The app starts but there are errors in the browser console:\n\n<errors>"
  // Truncate errors to max 800 chars
  // Return formatted string
}

// Helper: Generate route check message
function generateRouteCheckMessage(result: ValidationResult): string {
  // Check error string for route patterns
  // Return appropriate template
}

// Helper: Truncate message if needed
function truncateMessage(text: string, maxChars: number): string {
  // Return truncated text if needed
}

// Main function
export function composeFeedback(
  validationResults: ValidationResult[],
  promptNumber: number
): string | null {
  // 1. Check if all passed
  if (validationResults.every(r => r.passed)) {
    return null;
  }

  // 2. Filter failures
  const failures = validationResults.filter(r => !r.passed);

  // 3. Generate messages for each failure
  const messages = failures.map(result => {
    switch (result.type) {
      case "build":
        return generateBuildErrorMessage(result);
      case "browser":
        if (result.consoleErrors && result.consoleErrors.length > 0) {
          return generateConsoleErrorMessage(result);
        }
        return generateRouteCheckMessage(result);
      default:
        return "";
    }
  });

  // 4. Combine messages
  if (messages.length === 0) return null;

  if (messages.length === 1) {
    return messages[0];
  }

  // 5. Multiple failures - numbered list
  let combined = "A few issues I noticed:\n\n";
  messages.forEach((msg, index) => {
    combined += `${index + 1}. ${msg}\n`;
  });

  // 6. Truncate if needed
  const truncated = truncateMessage(combined, 2000);

  return truncated;
}
```

## Acceptance Criteria Checklist

- [ ] Returns `null` when all `ValidationResult.passed` are true
- [ ] Returns correct template for build errors
- [ ] Returns correct template for console errors
- [ ] Returns correct specific phrasing for each route check failure
- [ ] Uses numbered list format for multiple failures
- [ ] Total message is under 2000 chars
- [ ] No file names, line numbers, variable names, or fix suggestions in output
- [ ] TypeScript compiles without errors (`npx tsc --noEmit` from `harness/`)

## Testing Plan

1. Create test cases in `harness/src/feedback.test.ts` (optional, can use existing test framework)
2. Test scenarios:
   - All validations passed → null
   - Single build failure → correct template
   - Single console error → correct template
   - Single route check failure → correct specific phrase
   - Multiple failures → numbered list
   - Message truncation at 2000 chars

## Commit Message
```
phase5: symptom-based feedback generator
```