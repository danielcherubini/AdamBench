export function createAuthError(code, message) {
    const err = new Error(message);
    Object.defineProperty(err, "name", { value: "AuthError", configurable: true });
    Object.defineProperty(err, "code", { value: code, configurable: true });
    return err;
}
export function isAuthError(err) {
    return err instanceof Error && err.name === "AuthError";
}
//# sourceMappingURL=auth.js.map