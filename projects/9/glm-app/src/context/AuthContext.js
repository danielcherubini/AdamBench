import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
const AuthContext = createContext(undefined);
// Mock user database
const mockUsers = [
    {
        id: '1',
        name: 'John Doe',
        email: 'admin@example.com',
        role: 'admin'
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'user@example.com',
        role: 'user'
    }
];
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('authUser');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            }
            catch {
                localStorage.removeItem('authUser');
            }
        }
        setLoading(false);
    }, []);
    const login = async (email, password) => {
        setLoading(true);
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            // Find user by email
            const foundUser = mockUsers.find(u => u.email === email);
            // Simple validation: password must be at least 6 characters
            if (!foundUser || password.length < 6) {
                return false;
            }
            // Save user to localStorage
            localStorage.setItem('authUser', JSON.stringify(foundUser));
            setUser(foundUser);
            return true;
        }
        finally {
            setLoading(false);
        }
    };
    const logout = () => {
        localStorage.removeItem('authUser');
        setUser(null);
    };
    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
//# sourceMappingURL=AuthContext.js.map