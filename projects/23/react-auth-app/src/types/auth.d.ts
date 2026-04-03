export interface User {
    id: string;
    name: string;
    email: string;
    avatarInitials: string;
}
export type AuthErrorCode = "INVALID_CREDENTIALS" | "VALIDATION_ERROR" | "EMAIL_TAKEN" | "SESSION_CORRUPT" | "UNKNOWN";
export interface AuthError extends Error {
    readonly name: "AuthError";
    readonly code: AuthErrorCode;
}
export declare function createAuthError(code: AuthErrorCode, message: string): AuthError;
export declare function isAuthError(err: unknown): err is AuthError;
export interface AuthContextValue {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    updateProfile: (name: string, email: string) => Promise<void>;
}
//# sourceMappingURL=auth.d.ts.map