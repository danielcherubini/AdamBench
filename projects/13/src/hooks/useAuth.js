import { useCallback, useState, useRef, useEffect } from 'react';
import authService, { AuthError } from '../services/AuthService';
/**
 * Hook for authentication operations
 *
 * This hook provides authentication functionality in a way that's easy to test
 * and mock. It wraps the AuthService and provides React hooks.
 *
 * @param autoLogin - Whether to auto-login on mount (default: true)
 * @param onAuthChange - Callback when authentication state changes (default: undefined)
 */
export function useAuth(autoLogin = true, onAuthChange) {
    // Ref to track auth state for callbacks
    const authState = useRef({
        loginSuccess: false,
        loginFailure: false,
    });
    // Login function with error handling
    const login = useCallback(async (credentials) => {
        // Reset login state
        authState.current.loginSuccess = false;
        authState.current.loginFailure = false;
        try {
            const result = await authService.login(credentials);
            if (result) {
                // Auto-login if enabled
                if (autoLogin) {
                    localStorage.setItem('omnicoder_user', JSON.stringify({
                        ...result,
                        _password: credentials.password, // Temporarily store for session validation
                    }));
                    // Load user from storage to update the current user
                    await authService.loadUserFromStorage();
                }
                authState.current.loginSuccess = true;
                // Notify parent of auth change
                if (onAuthChange) {
                    onAuthChange();
                }
            }
        }
        catch (error) {
            authState.current.loginFailure = true;
            if (error instanceof Error && error.message === AuthError.INVALID_CREDENTIALS) {
                // Handle invalid credentials specifically
            }
            if (onAuthChange) {
                onAuthChange();
            }
        }
    }, [autoLogin, onAuthChange]);
    // Logout function
    const logout = useCallback(() => {
        authService.logout();
        authState.current.loginSuccess = false;
        authState.current.loginFailure = false;
        if (onAuthChange) {
            onAuthChange();
        }
    }, [onAuthChange]);
    // Clear session function
    const clearSession = useCallback(() => {
        authService.clearSession();
        authState.current.loginSuccess = false;
        authState.current.loginFailure = false;
        if (onAuthChange) {
            onAuthChange();
        }
    }, [onAuthChange]);
    // Load user from storage on mount if auto-login is enabled
    useEffect(() => {
        if (autoLogin) {
            authService.loadUserFromStorage();
        }
    }, [autoLogin]);
    return {
        user: authService.getCurrentUser(),
        isAuthenticated: !!authService.getCurrentUser(),
        isLoading: false,
        login,
        logout,
        clearSession,
        loginSuccess: authState.current.loginSuccess,
        loginFailure: authState.current.loginFailure,
    };
}
// Alternative hook without auto-login
export function useAuthManual(onAuthChange) {
    return useAuth(false, onAuthChange);
}
// Custom hook for checking auth errors
export function useAuthError() {
    const [error, setError] = useState(null);
    const isError = !!error;
    const clearError = useCallback(() => {
        setError(null);
    }, []);
    return { error, isError, clearError };
}
//# sourceMappingURL=useAuth.js.map