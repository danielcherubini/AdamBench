import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useEffect } from "react";
import { createAuthError, isAuthError } from "./types/auth";
const USERS = [
    { id: "1", name: "Alice Johnson", email: "alice@example.com", password: "password123", avatarInitials: "AJ" },
    { id: "2", name: "Bob Smith", email: "bob@example.com", password: "password123", avatarInitials: "BS" },
];
function deriveInitials(name) {
    return name.trim().split(/\s+/).map((w) => w[0]?.toUpperCase() ?? "").slice(0, 2).join("");
}
function simulateDelay(ms) {
    return new Promise((r) => setTimeout(r, ms));
}
// ── Session storage ───────────────────────────────────────────────────────────
const SESSION_KEY = "auth_user";
function loadSession() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw)
        return null;
    try {
        return JSON.parse(raw);
    }
    catch {
        sessionStorage.removeItem(SESSION_KEY);
        throw createAuthError("SESSION_CORRUPT", "Stored session was unreadable and has been cleared.");
    }
}
// ── Validation ────────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateEmail(email) {
    if (!email)
        throw createAuthError("VALIDATION_ERROR", "Email is required.");
    if (!EMAIL_RE.test(email))
        throw createAuthError("VALIDATION_ERROR", "Please enter a valid email address.");
}
function validatePassword(password) {
    if (!password)
        throw createAuthError("VALIDATION_ERROR", "Password is required.");
    if (password.length < 6)
        throw createAuthError("VALIDATION_ERROR", "Password must be at least 6 characters.");
}
function validateName(name) {
    if (!name)
        throw createAuthError("VALIDATION_ERROR", "Name is required.");
    if (name.length < 2)
        throw createAuthError("VALIDATION_ERROR", "Name must be at least 2 characters.");
    if (name.length > 60)
        throw createAuthError("VALIDATION_ERROR", "Name must be 60 characters or fewer.");
}
// ── Context ───────────────────────────────────────────────────────────────────
export const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        try {
            setUser(loadSession());
        }
        catch { /* corrupt session cleared, stay logged out */ }
        finally {
            setIsLoading(false);
        }
    }, []);
    async function login(email, password) {
        const e = email.trim().toLowerCase();
        validateEmail(e);
        validatePassword(password);
        await simulateDelay(800);
        const match = USERS.find((u) => u.email === e && u.password === password);
        if (!match)
            throw createAuthError("INVALID_CREDENTIALS", "Invalid email or password.");
        const { password: _, ...loggedIn } = match;
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(loggedIn));
        setUser(loggedIn);
    }
    function logout() {
        sessionStorage.removeItem(SESSION_KEY);
        setUser(null);
    }
    async function updateProfile(name, email) {
        if (!user)
            throw new Error("Not logged in.");
        const n = name.trim();
        const e = email.trim().toLowerCase();
        validateName(n);
        validateEmail(e);
        await simulateDelay(600);
        const emailTaken = USERS.some((u) => u.email === e && u.id !== user.id);
        if (emailTaken)
            throw createAuthError("EMAIL_TAKEN", "That email address is already in use.");
        // Update the in-memory store so re-login reflects the change
        const idx = USERS.findIndex((u) => u.id === user.id);
        if (idx !== -1) {
            USERS[idx] = { ...USERS[idx], name: n, email: e, avatarInitials: deriveInitials(n) };
        }
        const updated = { ...user, name: n, email: e, avatarInitials: deriveInitials(n) };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
        setUser(updated);
    }
    return (_jsx(AuthContext.Provider, { value: { user, isAuthenticated: !!user, isLoading, login, logout, updateProfile }, children: children }));
}
// ── Re-export isAuthError so consumers don't need a separate import ───────────
export { isAuthError };
//# sourceMappingURL=AuthContext.js.map