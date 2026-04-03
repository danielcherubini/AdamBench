import { AuthError } from '../services/AuthService';
export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}
export interface UseAuthReturn {
    /** Current user or null if not authenticated */
    user: User | null;
    /** Whether user is authenticated */
    isAuthenticated: boolean;
    /** Whether authentication is in progress */
    isLoading: boolean;
    /** Login with credentials */
    login: (credentials: LoginCredentials) => Promise<void>;
    /** Logout current user */
    logout: () => void;
    /** Clear session data */
    clearSession: () => void;
    /** Check if login was successful */
    loginSuccess: boolean;
    /** Check if login failed */
    loginFailure: boolean;
}
export interface LoginCredentials {
    email: string;
    password: string;
}
export type AuthErrorType = typeof AuthError[keyof typeof AuthError];
/**
 * Hook for authentication operations
 *
 * This hook provides authentication functionality in a way that's easy to test
 * and mock. It wraps the AuthService and provides React hooks.
 *
 * @param autoLogin - Whether to auto-login on mount (default: true)
 * @param onAuthChange - Callback when authentication state changes (default: undefined)
 */
export declare function useAuth(autoLogin?: boolean, onAuthChange?: () => void): UseAuthReturn;
export declare function useAuthManual(onAuthChange?: () => void): UseAuthReturn;
export declare function useAuthError(): {
    error: Error | null;
    isError: boolean;
    clearError: () => void;
};
//# sourceMappingURL=useAuth.d.ts.map