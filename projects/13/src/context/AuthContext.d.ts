import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, LoginCredentials } from '../types';
export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    clearSession: () => void;
    loginSuccess: boolean;
    loginFailure: boolean;
}
interface AuthProviderProps {
    children: ReactNode;
}
/**
 * AuthContext Provider
 *
 * Wraps the application to provide authentication context.
 * This is a simple wrapper around useAuth hook for compatibility.
 */
export declare function AuthProvider({ children }: AuthProviderProps): any;
/**
 * Custom hook to access auth context
 *
 * Must be used within AuthProvider.
 * Throws error if used outside of provider.
 */
export declare function useAuthContext(): AuthContextType;
export { useAuth };
export { authService, AuthError } from '../services/AuthService';
//# sourceMappingURL=AuthContext.d.ts.map