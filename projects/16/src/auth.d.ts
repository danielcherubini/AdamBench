import type { ReactNode } from 'react';
export interface User {
    name: string;
    email: string;
}
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface UpdateProfileData {
    name: string;
    email: string;
}
export declare const AuthProvider: ({ children }: {
    children: ReactNode;
}) => any;
export declare const useAuth: () => any;
//# sourceMappingURL=auth.d.ts.map