export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}
export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    clearSession: () => void;
    loginSuccess: boolean;
    loginFailure: boolean;
}
export declare enum AuthError {
    INVALID_CREDENTIALS = "Invalid credentials",
    NETWORK_ERROR = "Network error",
    SESSION_EXPIRED = "Session expired",
    UNAUTHORIZED = "Unauthorized"
}
export interface AuthServiceInterface {
    login(credentials: LoginCredentials): Promise<User | null>;
    logout(): void;
    getCurrentUser(): User | null;
    clearSession(): void;
    loadUserFromStorage(): Promise<User | null>;
}
export interface UserDatabaseEntry {
    email: string;
    password: string;
    name: string;
}
//# sourceMappingURL=index.d.ts.map