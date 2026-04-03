import type { User, LoginCredentials, UpdateProfileData } from '../types';
export declare function login({ email, password }: LoginCredentials): Promise<User>;
export declare function logout(): Promise<void>;
export declare function getCurrentUser(): Promise<User | null>;
export declare function updateProfile(data: UpdateProfileData): Promise<User>;
//# sourceMappingURL=auth.d.ts.map