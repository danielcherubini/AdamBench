import React, { ReactNode } from 'react';
import { User } from '../types';
export interface AuthActions {
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateUser: (user: User) => Promise<void>;
}
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
interface AuthContextType {
    state: AuthState;
    actions: AuthActions;
}
export declare class AuthService {
    private static STORAGE_KEY;
    static performLogin(email: string, password: string): Promise<{
        success: boolean;
        user?: User;
        error?: string;
    }>;
    static updateUser(user: User): Promise<void>;
    static saveUserToStorage(user: User): void;
    static getUserFromStorage(): User | null;
    static clearUserFromStorage(): void;
}
export declare const AuthProvider: React.FC<{
    children: ReactNode;
}>;
export declare const useAuth: () => AuthContextType;
export declare const useAuthState: () => AuthState;
export declare const useAuthActions: () => AuthActions;
export {};
//# sourceMappingURL=authService.d.ts.map