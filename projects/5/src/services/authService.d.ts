import type { LoginCredentials, AuthResponse, User } from '../types/auth';
export declare class AuthService {
    private storage;
    constructor();
    login(credentials: LoginCredentials): Promise<AuthResponse>;
    logout(): Promise<void>;
    getCurrentUser(): User | null;
    isAuthenticated(): boolean;
    private delay;
}
export declare const authService: AuthService;
//# sourceMappingURL=authService.d.ts.map