import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useState } from 'react';
const AUTH_KEY = 'auth_user';
const AuthContext = createContext(undefined);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getStoredUser = () => {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw)
        return null;
    try {
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
};
const saveUser = (user) => localStorage.setItem(AUTH_KEY, JSON.stringify(user));
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => getStoredUser());
    const login = async ({ email, password }) => {
        await delay(400);
        if (!email || !password)
            throw new Error('Email and password are required');
        if (password.length < 4)
            throw new Error('Invalid credentials');
        const loggedInUser = { name: email.split('@')[0] || 'User', email };
        saveUser(loggedInUser);
        setUser(loggedInUser);
    };
    const logout = () => {
        localStorage.removeItem(AUTH_KEY);
        setUser(null);
    };
    const updateProfile = ({ name, email }) => {
        if (!name.trim() || !email.trim())
            throw new Error('Name and email are required');
        if (!user)
            throw new Error('Not authenticated');
        const updatedUser = { ...user, name: name.trim(), email: email.trim() };
        saveUser(updatedUser);
        setUser(updatedUser);
    };
    const value = useMemo(() => ({ user, isAuthenticated: !!user, login, logout, updateProfile }), [user]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
//# sourceMappingURL=auth.js.map