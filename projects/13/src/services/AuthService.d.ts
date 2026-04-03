import { User, LoginCredentials } from '../types';
export interface AuthServiceInterface {
    login(credentials: LoginCredentials): Promise<User | null>;
    logout(): void;
    getCurrentUser(): User | null;
    clearSession(): void;
}
export declare enum AuthError {
    INVALID_CREDENTIALS = "Invalid credentials",
    NETWORK_ERROR = "Network error",
    SESSION_EXPIRED = "Session expired",
    UNAUTHORIZED = "Unauthorized"
}
export declare class AuthService implements AuthServiceInterface {
    private user;
    /**
     * Authenticate user with provided credentials
     */
    login(credentials: LoginCredentials): Promise<User | null>;
    /**
     * Logout current user
     */
    logout(): void;
    /**
     * Get current user
     */
    getCurrentUser(): User | null;
    /**
     * Clear all session data
     */
    clearSession(): void;
    /**
     * Load user from storage (for session persistence)
     */
    loadUserFromStorage(): Promise<User | null>;
    /**
     * Private: Find user by email in database
     */
    private findUserByEmail;
    /**
     * Private: Get next available user ID
     */
    private getNextUserId;
    /**
     * Private: Generate avatar URL from name
     */
    private generateAvatar;
    /**
     * Private: Simulate network delay
     */
    private delay;
}
export declare const authService: AuthService;
export default authService;
//# sourceMappingURL=AuthService.d.ts.map