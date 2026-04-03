/**
 * Authentication Storage Module
 * Handles localStorage operations and user data storage
 * Can be easily swapped for different storage backends (API, Redis, etc.)
 */
export declare const getUserStore: () => Map<string, UserMock>;
export interface UserMock {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
}
export interface AuthStorage {
    getStoredUser(): UserMock | null;
    setStoredUser(user: UserMock | null): void;
    removeStoredUser(): void;
    getStoredUsers(): Map<string, UserMock>;
    setStoredUsers(users: Map<string, UserMock>): void;
}
export declare const createAuthStorage: () => AuthStorage;
export declare const authStorage: AuthStorage;
/**
 * Initialize mock users in localStorage if not present
 * Call this once in your app initialization
 */
export declare const initMockUsersIfNeeded: () => void;
export declare const clearAuth: () => void;
//# sourceMappingURL=authStorage.d.ts.map