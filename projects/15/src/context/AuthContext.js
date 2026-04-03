import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Context
const AuthContext = createContext(undefined);
// Provider
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Check for existing session on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);
    const login = async (email, _password) => {
        setIsLoading(true);
        setError(null);
        try {
            // Simple mock authentication
            const mockUser = { email, name: email.split('@')[0] };
            setUser(mockUser);
            localStorage.setItem('user', JSON.stringify(mockUser));
        }
        catch (err) {
            setError('Login failed');
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setError(null);
    };
    return (_jsx(AuthContext.Provider, { value: { user, isAuthenticated: !!user, isLoading, error, login, logout }, children: children }));
};
// Custom hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
export default AuthContext;
//# sourceMappingURL=AuthContext.js.map