import React, { ReactNode } from 'react';
export interface User {
    email: string;
    name?: string;
}
export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password?: string) => Promise<void>;
    logout: () => void;
    error: string | null;
}
declare const AuthContext: any;
export declare const AuthProvider: React.FC<{
    children: ReactNode;
}>;
export declare const useAuth: () => AuthContextType;
export default AuthContext;
//# sourceMappingURL=AuthContext.d.ts.map