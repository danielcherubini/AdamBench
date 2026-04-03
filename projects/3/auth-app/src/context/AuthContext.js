import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
const AuthContext = createContext(undefined);
const FAKE_USERS = [
    { email: 'user@example.com', password: 'password123', user: { id: '1', email: 'user@example.com', name: 'Demo User' } },
    { email: 'admin@example.com', password: 'admin123', user: { id: '2', email: 'admin@example.com', name: 'Admin User' } },
];
const STORAGE_KEY = 'auth_user';
function simulateDelay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        setUser(stored ? JSON.parse(stored) : null);
        setIsLoading(false);
    }, []);
    const login = useCallback(async (email, password) => {
        setError(null);
        setIsLoading(true);
        try {
            await simulateDelay();
            const found = FAKE_USERS.find(u => u.email === email.toLowerCase() && u.password === password);
            if (!found)
                throw new Error('Invalid email or password');
            localStorage.setItem(STORAGE_KEY, JSON.stringify(found.user));
            setUser(found.user);
        }
        catch (err) {
            setUser(null);
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
        setError(null);
    }, []);
    const updateUser = useCallback(async (updates) => {
        if (!user)
            throw new Error('No user logged in');
        setIsLoading(true);
        try {
            await simulateDelay(300);
            if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
                throw new Error('Invalid email format');
            }
            const updatedUser = { ...user, ...(updates.name && { name: updates.name }), ...(updates.email && { email: updates.email }) };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
            setUser(updatedUser);
        }
        finally {
            setIsLoading(false);
        }
    }, [user]);
    const clearError = useCallback(() => setError(null), []);
    return (_jsx(AuthContext.Provider, { value: { user, isAuthenticated: !!user, isLoading, error, login, logout, updateUser, clearError }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within AuthProvider');
    return context;
};
//# sourceMappingURL=AuthContext.js.map