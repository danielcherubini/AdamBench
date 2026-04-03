import { ReactNode } from 'react';
export interface User {
    id: string;
    email: string;
    name: string;
}
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}
declare const AuthContext: any;
export declare const AuthProvider: ({ children }: {
    children: ReactNode;
}) => any;
export declare const useAuth: () => AuthContextType;
export default AuthContext;
//# sourceMappingURL=AuthContext.d.ts.map