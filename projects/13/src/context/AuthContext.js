import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, LoginCredentials } from '../types';
// Create context with default undefined value
const AuthContext = createContext(undefined);
/**
 * AuthContext Provider
 *
 * Wraps the application to provide authentication context.
 * This is a simple wrapper around useAuth hook for compatibility.
 */
export function AuthProvider({ children }) {
    // Use the refactored useAuth hook
    const auth = useAuth(true);
    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        user: auth.user,
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        login: auth.login,
        logout: auth.logout,
        clearSession: auth.clearSession,
        loginSuccess: auth.loginSuccess,
        loginFailure: auth.loginFailure,
    }), [auth]);
    return _jsx(AuthContext.Provider, { value: contextValue, children: children });
}
/**
 * Custom hook to access auth context
 *
 * Must be used within AuthProvider.
 * Throws error if used outside of provider.
 */
export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}
// Re-export useAuth for convenience
export { useAuth };
// Re-export service for testing/mock purposes
export { authService, AuthError } from '../services/AuthService';
//# sourceMappingURL=AuthContext.js.map