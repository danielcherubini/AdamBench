import { User } from '../types/auth';
export declare const protectedRouteService: {
    checkAuth: () => Promise<{
        isAuthenticated: boolean;
        user: User | null;
        role: "user" | "admin";
    }>;
    validateAuth: () => Promise<boolean>;
};
//# sourceMappingURL=protectedRouteService.d.ts.map