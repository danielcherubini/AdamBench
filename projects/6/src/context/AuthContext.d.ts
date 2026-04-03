import React, { ReactNode } from 'react';
/**
 * Context shape exposed to components.
 * `login` and `logout` delegate to the auth service, making the logic
 * reusable and easily mockable in tests.
 */
interface AuthContextType {
    user: string | null;
    profile: {
        name: string;
        email: string;
    } | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateProfile: (data: {
        name: string;
        email: string;
    }) => void;
}
export declare const AuthProvider: React.FC<{
    children: ReactNode;
}>;
export declare const useAuth: () => AuthContextType;
export {};
//# sourceMappingURL=AuthContext.d.ts.map