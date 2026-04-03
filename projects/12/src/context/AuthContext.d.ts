import { ReactNode } from 'react';
export interface User {
    id: string;
    name: string;
    email: string;
}
export interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (name: string, email: string) => Promise<void>;
}
export declare const AuthProvider: ({ children }: {
    children: ReactNode;
}) => any;
export declare const useAuth: () => AuthContextType;
//# sourceMappingURL=AuthContext.d.ts.map