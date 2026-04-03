import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, LoginForm } from '../types';
export const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const { user, isAuthenticated, isLoading, login, logout, } = useAuth(children, 100);
    const loginFailed = false; // Will be passed from LoginPage
    const value = {
        user,
        isAuthenticated,
        isLoading,
        login: async (credentials) => {
            try {
                await login(credentials);
            }
            catch (error) {
                if (error.loginFailed) {
                    throw error;
                }
            }
        },
        loginFailed,
        logout,
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
//# sourceMappingURL=AuthContext.js.map