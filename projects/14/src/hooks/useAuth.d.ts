import { ReactNode } from 'react';
import { User, LoginForm } from '../types';
/**
 * Custom hook for authentication management
 * Provides a clean API for authentication state and actions
 */
export declare const useAuth: (children: ReactNode, isLoadingDelay?: number) => {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginForm) => Promise<void>;
    logout: () => void;
};
/**
 * Simple wrapper for login with better error handling
 */
export declare const useLogin: () => {
    login: (credentials: LoginForm) => Promise<void>;
    loginFailed: boolean;
};
//# sourceMappingURL=useAuth.d.ts.map