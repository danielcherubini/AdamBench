import React from 'react';
import type { ReactNode } from 'react';
export interface User {
    id: string;
    name: string;
    email: string;
}
export declare const useAuth: () => any;
interface AuthProviderProps {
    children: ReactNode;
}
export declare const AuthProvider: React.FC<AuthProviderProps>;
export {};
//# sourceMappingURL=AuthContext.d.ts.map