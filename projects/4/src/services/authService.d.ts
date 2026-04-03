import { User } from '../types/auth';
export declare const USER_STORAGE_KEY = "user";
export declare class AuthService {
    login(user: User): void;
    logout(): void;
    getCurrentUser(): User | null;
}
export declare const authService: AuthService;
//# sourceMappingURL=authService.d.ts.map