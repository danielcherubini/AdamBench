import { User, LoginForm } from '../types';
export declare const MOCK_USERS: User[];
export declare const AUTH_STORAGE_KEY = "auth_user";
/**
 * Check if user is authenticated (check localStorage)
 */
export declare const isUserAuthenticated: () => boolean;
/**
 * Get current user from storage
 */
export declare const getCurrentUser: () => User | null;
/**
 * Store user in localStorage
 */
export declare const storeUser: (user: User) => void;
/**
 * Remove user from localStorage
 */
export declare const removeUser: () => void;
/**
 * Authenticate user with credentials
 * @param credentials - Email and password
 * @returns User object if authenticated, null otherwise
 */
export declare const authenticateUser: (credentials: LoginForm) => Promise<User | null>;
/**
 * Get all mock users
 */
export declare const getMockUsers: () => User[];
/**
 * Check if email exists in mock users
 */
export declare const doesEmailExist: (email: string) => boolean;
//# sourceMappingURL=auth.service.d.ts.map