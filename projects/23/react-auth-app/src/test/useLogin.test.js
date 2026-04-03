import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { createAuthError } from "../types/auth";
import { LoginPage } from "../pages/LoginPage";
// ── Test helpers ──────────────────────────────────────────────────────────────
function makeContextValue(overrides) {
    return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: vi.fn().mockResolvedValue(undefined),
        logout: vi.fn(),
        updateProfile: vi.fn().mockResolvedValue(undefined),
        ...overrides,
    };
}
function renderLoginPage({ ctxValue, initialPath = "/login" } = {}) {
    const ctx = makeContextValue(ctxValue);
    render(_jsx(AuthContext.Provider, { value: ctx, children: _jsx(MemoryRouter, { initialEntries: [initialPath], children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx("div", { children: "Dashboard" }) })] }) }) }));
    return { ctx };
}
// ── Tests ─────────────────────────────────────────────────────────────────────
describe("LoginPage / useLogin", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it("renders email and password fields and a submit button", () => {
        renderLoginPage();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    });
    it("calls login with the values the user typed", async () => {
        const { ctx } = renderLoginPage();
        const user = userEvent.setup();
        await user.type(screen.getByLabelText(/email address/i), "alice@example.com");
        await user.type(screen.getByLabelText(/password/i), "password123");
        await user.click(screen.getByRole("button", { name: /sign in/i }));
        await waitFor(() => {
            expect(ctx.login).toHaveBeenCalledWith("alice@example.com", "password123");
        });
    });
    it("navigates to /dashboard after successful login", async () => {
        renderLoginPage();
        const user = userEvent.setup();
        await user.type(screen.getByLabelText(/email address/i), "alice@example.com");
        await user.type(screen.getByLabelText(/password/i), "password123");
        await user.click(screen.getByRole("button", { name: /sign in/i }));
        await waitFor(() => {
            expect(screen.getByText("Dashboard")).toBeInTheDocument();
        });
    });
    it("shows an AuthError message when login throws AuthError", async () => {
        renderLoginPage({
            ctxValue: {
                login: vi.fn().mockRejectedValue(createAuthError("INVALID_CREDENTIALS", "Invalid email or password.")),
            },
        });
        const user = userEvent.setup();
        await user.type(screen.getByLabelText(/email address/i), "alice@example.com");
        await user.type(screen.getByLabelText(/password/i), "wrongpass");
        await user.click(screen.getByRole("button", { name: /sign in/i }));
        expect(await screen.findByRole("alert")).toHaveTextContent("Invalid email or password.");
    });
    it("shows a generic message for unexpected errors", async () => {
        renderLoginPage({
            ctxValue: {
                login: vi.fn().mockRejectedValue(new Error("Network failure")),
            },
        });
        const user = userEvent.setup();
        await user.type(screen.getByLabelText(/email address/i), "alice@example.com");
        await user.type(screen.getByLabelText(/password/i), "password123");
        await user.click(screen.getByRole("button", { name: /sign in/i }));
        expect(await screen.findByRole("alert")).toHaveTextContent(/unexpected error/i);
    });
    it("disables the submit button while submitting", async () => {
        renderLoginPage({
            ctxValue: { login: vi.fn().mockReturnValue(new Promise(() => { })) },
        });
        const user = userEvent.setup();
        await user.type(screen.getByLabelText(/email address/i), "alice@example.com");
        await user.type(screen.getByLabelText(/password/i), "password123");
        await user.click(screen.getByRole("button", { name: /sign in/i }));
        await waitFor(() => {
            expect(screen.getByRole("button")).toBeDisabled();
        });
    });
    it("clears a previous error when submitting again", async () => {
        let callCount = 0;
        renderLoginPage({
            ctxValue: {
                login: vi.fn().mockImplementation(() => {
                    callCount++;
                    if (callCount === 1) {
                        return Promise.reject(createAuthError("INVALID_CREDENTIALS", "Bad creds"));
                    }
                    return Promise.resolve();
                }),
            },
        });
        const user = userEvent.setup();
        await user.type(screen.getByLabelText(/email address/i), "alice@example.com");
        await user.type(screen.getByLabelText(/password/i), "wrongpass");
        await user.click(screen.getByRole("button", { name: /sign in/i }));
        expect(await screen.findByRole("alert")).toBeInTheDocument();
        // Second attempt — error should be cleared before the new attempt resolves
        await user.click(screen.getByRole("button", { name: /sign in/i }));
        await waitFor(() => {
            expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=useLogin.test.js.map