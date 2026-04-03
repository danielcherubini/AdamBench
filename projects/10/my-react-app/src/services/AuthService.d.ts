import type { User } from '../context/AuthTypes';
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}
export declare class FakeAuthService {
    private state;
    constructor();
    private save;
    getState(): AuthState;
    login: () => void;
    logout(): void;
    updateProfile(partial: Partial<User>): void;
}
export declare const authService: FakeAuthService;
//# sourceMappingURL=AuthService.d.ts.map