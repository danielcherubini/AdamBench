import React from 'react';
import { User } from '../types/auth';
export interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}
export declare const useAuth: () => any;
export declare const AuthProvider: React.FC<{
    children: React.ReactNode;
}>;
//# sourceMappingURL=AuthContext.d.ts.map