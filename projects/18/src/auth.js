import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
const STORAGE_KEY = 'auth_user';
// Fake users database
const USERS = [
    { email: 'admin@example.com', password: 'admin123', name: 'Admin User' },
    { email: 'user@example.com', password: 'user123', name: 'Test User' },
];
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored)
            setUser(JSON.parse(stored));
        setIsLoading(false);
    }, []);
    const login = useCallback(async (email, password) => {
        await delay(800);
        const found = USERS.find((u) => u.email === email && u.password === password);
        if (found) {
            const u = { email: found.email, name: found.name };
            setUser(u);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
            return true;
        }
        return false;
    }, []);
    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    }, []);
    const updateProfile = useCallback(async (name, email) => {
        await delay(500);
        if (!user)
            return false;
        const updated = { ...user, name, email };
        setUser(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return true;
    }, [user]);
    return (_jsx(AuthContext.Provider, { value: { user, isLoading, isAuthenticated: !!user, login, logout, updateProfile }, children: children }));
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
export function RequireAuth({ children }) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    if (isLoading)
        return _jsx("div", { className: "loading", children: "Loading..." });
    if (!isAuthenticated)
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    return _jsx(_Fragment, { children: children });
}
//# sourceMappingURL=auth.js.map