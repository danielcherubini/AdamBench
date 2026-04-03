import React, { ReactNode } from 'react';
import { User, LoginForm } from '../types';
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
export interface AuthContextType extends AuthState {
    login: (credentials: LoginForm) => Promise<void>;
    loginFailed: boolean;
    logout: () => void;
}
export declare const AuthContext: any;
export declare const AuthProvider: React.FC<{
    children: ReactNode;
}>;
export declare const useAuthContext: () => AuthContextType;
//# sourceMappingURL=AuthContext.d.ts.map