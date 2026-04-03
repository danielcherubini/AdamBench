export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
}
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface LoginResponse {
    user: User;
    token?: string;
}
export interface AuthContextValue extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}
//# sourceMappingURL=auth.d.ts.map