import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/auth';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Check for existing session on mount
    useEffect(() => {
        authService.getCurrentUser().then((u) => {
            setUser(u);
            setIsLoading(false);
        });
    }, []);
    const login = useCallback(async (credentials) => {
        setError(null);
        setIsLoading(true);
        try {
            const user = await authService.login(credentials);
            setUser(user);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const logout = useCallback(async () => {
        await authService.logout();
        setUser(null);
    }, []);
    const updateProfile = useCallback(async (data) => {
        setError(null);
        try {
            const updated = await authService.updateProfile(data);
            setUser(updated);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Update failed');
            throw err;
        }
    }, []);
    const clearError = useCallback(() => setError(null), []);
    return (_jsx(AuthContext.Provider, { value: {
            user,
            isAuthenticated: !!user,
            isLoading,
            error,
            login,
            logout,
            updateProfile,
            clearError,
        }, children: children }));
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within AuthProvider');
    return context;
}
//# sourceMappingURL=AuthContext.js.map