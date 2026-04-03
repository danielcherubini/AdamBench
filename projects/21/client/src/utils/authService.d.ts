/**
 * Authentication Service Module
 * Handles business logic for authentication operations
 * Can be easily mocked for testing
 */
import { User, LoginCredentials, LoginResponse } from '../types/auth';
export declare class AuthError extends Error {
    constructor(message: string);
}
export declare class InvalidCredentialsError extends AuthError {
    constructor();
}
export type MockApi = {
    login: (email: string, password: string) => Promise<LoginResponse>;
    getUser: (email: string) => Promise<User>;
};
export declare const createMockApi: () => MockApi;
export declare const authService: {
    login(credentials: LoginCredentials): Promise<void>;
    logout(): void;
    isAuthenticated(): boolean;
    getCurrentUser(): User | null;
    setMockApi(api: MockApi): void;
};
//# sourceMappingURL=authService.d.ts.map