import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { isValidEmail } from '../utils';
const AuthContext = createContext(undefined);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = () => {
            try {
                const stored = localStorage.getItem('fakeAuthUser');
                if (stored) {
                    setUser(JSON.parse(stored));
                }
            }
            catch (err) {
                console.error('Error loading user from storage:', err);
                setError('Failed to load user session');
            }
            finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);
    const clearError = useCallback(() => setError(null), []);
    const login = useCallback(async (email, password) => {
        setError(null);
        setLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 100));
            if (email.trim() && password.trim()) {
                const newUser = {
                    id: '1',
                    name: 'John Doe',
                    email: email,
                };
                setUser(newUser);
                localStorage.setItem('fakeAuthUser', JSON.stringify(newUser));
                return { success: true };
            }
            else {
                setError('Email and password are required');
                return { success: false, error: 'Email and password are required' };
            }
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
        finally {
            setLoading(false);
        }
    }, []);
    const logout = useCallback(async () => {
        setError(null);
        setLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 50));
            setUser(null);
            localStorage.removeItem('fakeAuthUser');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Logout failed';
            setError(errorMessage);
            console.error('Logout error:', err);
        }
        finally {
            setLoading(false);
        }
    }, []);
    const updateUser = useCallback(async (userId, data) => {
        setError(null);
        setLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 100));
            if (!user || user.id !== userId) {
                setError('User not found');
                return { success: false, error: 'User not found' };
            }
            // Validate email format if provided
            if (data.email && !isValidEmail(data.email)) {
                setError('Invalid email format');
                return { success: false, error: 'Invalid email format' };
            }
            const updatedUser = {
                ...user,
                ...data,
            };
            setUser(updatedUser);
            localStorage.setItem('fakeAuthUser', JSON.stringify(updatedUser));
            return { success: true };
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
        finally {
            setLoading(false);
        }
    }, [user]);
    const isAuthenticated = !!user;
    const contextValue = {
        user,
        isAuthenticated,
        login,
        logout,
        updateUser,
        loading,
        error,
        clearError,
    };
    return (_jsx(AuthContext.Provider, { value: contextValue, children: children }));
};
//# sourceMappingURL=AuthContext.js.map