import type { User, LoginCredentials, ProfileUpdate } from '../types/auth';
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<boolean>;
    logout: () => void;
    updateProfile: (update: ProfileUpdate) => Promise<boolean>;
}
export declare const useAuth: () => AuthState;
//# sourceMappingURL=useAuth.d.ts.map