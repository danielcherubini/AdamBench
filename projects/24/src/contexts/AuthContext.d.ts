import type { ReactNode } from 'react';
import type { User, LoginCredentials, UpdateProfileData } from '../types';
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: UpdateProfileData) => Promise<void>;
    clearError: () => void;
}
export declare function AuthProvider({ children }: {
    children: ReactNode;
}): any;
export declare function useAuth(): AuthContextType;
export {};
//# sourceMappingURL=AuthContext.d.ts.map