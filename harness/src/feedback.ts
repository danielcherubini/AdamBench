import type { ValidationResult } from "./types.js";

/**
 * Compose a symptom-based feedback message from validation results.
 * Returns null if all validations passed (no feedback needed).
 * 
 * @param validationResults - Array of validation results from Phase 4
 * @param promptNumber - Used to tailor the message context
 * @returns Symptom-based feedback string or null if all passed
 */
export function composeFeedback(
  validationResults: ValidationResult[],
  promptNumber: number
): string | null {
  // 1. Check if all validations passed
  if (validationResults.every((r) => r.passed)) {
    return null;
  }

  // 2. Filter failures
  const failures = validationResults.filter((r) => !r.passed);

  // 3. Generate messages for each failure
  const messages = failures.map((result) => {
    switch (result.type) {
      case "build":
        return generateBuildErrorMessage(result);
      case "browser":
        if (result.consoleErrors && result.consoleErrors.length > 0) {
          return generateConsoleErrorMessage(result);
        }
        if (result.errors && result.errors.length > 0) {
          return generateRouteCheckMessage(result, promptNumber);
        }
        return "";
      case "runtime":
      default:
        return generateRuntimeErrorMessage(result);
    }
  });

  // Filter out empty messages
  const nonEmptyMessages = messages.filter((msg) => msg.length > 0);

  // 4. Combine messages
  if (nonEmptyMessages.length === 0) {
    return null;
  }

  if (nonEmptyMessages.length === 1) {
    return nonEmptyMessages[0];
  }

  // 5. Multiple failures - numbered list
  let combined = "A few issues I noticed:\n\n";
  nonEmptyMessages.forEach((msg, index) => {
    combined += `${index + 1}. ${msg}\n`;
  });

  // 6. Truncate if needed (keep under 2000 chars)
  return truncateMessage(combined, 2000);
}

/**
 * Generate message for build errors
 */
function generateBuildErrorMessage(result: ValidationResult): string {
  const errors = result.errors?.join("\n") || "";
  
  // Truncate to max 1500 chars
  const truncatedErrors = truncateMessage(errors, 1500);

  return `The project doesn't build. Here are the errors:

${truncatedErrors}`;
}

/**
 * Generate message for browser console errors
 */
function generateConsoleErrorMessage(result: ValidationResult): string {
  const errors = result.consoleErrors?.join("\n") || "";
  
  // Truncate to max 800 chars
  const truncatedErrors = truncateMessage(errors, 800);

  return `The app starts but there are errors in the browser console:

${truncatedErrors}`;
}

/**
 * Generate message for route/element check failures
 */
function generateRouteCheckMessage(
  result: ValidationResult,
  promptNumber: number
): string {
  const errorText = result.errors?.join(" ") || "";
  const errorString = errorText.toLowerCase();

  // Check for specific route patterns and return appropriate message
  if (errorString.includes("/login") && errorString.includes("no input")) {
    return "I navigated to /login but the page appears blank — there's no login form visible.";
  }

  if (errorString.includes("/dashboard") && errorString.includes("redirect")) {
    return "I tried to access /dashboard without logging in, but it doesn't redirect me to the login page.";
  }

  if (errorString.includes("/profile")) {
    return "The /profile page doesn't seem to have editable fields for name and email.";
  }

  if (errorString.includes("/snake")) {
    if (errorString.includes("canvas") || errorString.includes("game")) {
      return "I navigated to /snake but I don't see a game. The page appears empty.";
    }
    if (errorString.includes("rules") || errorString.includes("controls")) {
      return "The snake page doesn't show any rules or controls description.";
    }
  }

  // Default: use raw error string
  return errorText;
}

/**
 * Generate message for runtime errors (fallback)
 */
function generateRuntimeErrorMessage(result: ValidationResult): string {
  const errors = result.errors?.join("\n") || "";
  
  // Truncate to max 1500 chars
  const truncatedErrors = truncateMessage(errors, 1500);

  return `The project doesn't build. Here are the errors:

${truncatedErrors}`;
}

/**
 * Truncate message if it exceeds max length
 */
function truncateMessage(text: string, maxChars: number): string {
  if (text.length <= maxChars) {
    return text;
  }

  // Truncate and add ellipsis
  const truncated = text.substring(0, maxChars - 3) + "...";
  return truncated;
}