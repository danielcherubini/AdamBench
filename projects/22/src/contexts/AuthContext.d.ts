import { type ReactNode } from 'react';
import type { User, LoginCredentials, AuthError, ProfileUpdate } from '../types';
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: AuthError | null;
    login: (credentials: LoginCredentials) => Promise<AuthError | null>;
    logout: () => void;
    updateUser: (updates: ProfileUpdate) => Promise<AuthError | null>;
    clearError: () => void;
}
export declare function AuthProvider({ children }: {
    children: ReactNode;
}): any;
export declare function useAuth(): AuthContextType;
export {};
//# sourceMappingURL=AuthContext.d.ts.map