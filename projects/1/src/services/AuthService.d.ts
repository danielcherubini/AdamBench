export interface User {
    id: string;
    email: string;
    name: string;
}
export interface Credential {
    password: string;
    name: string;
}
export interface UserCredentials {
    email: string;
    password: string;
    name?: string;
}
export declare class AuthService {
    private static users;
    static validateUser(email: string, password: string): Promise<User | null>;
    static validateUserThrow(email: string, password: string): Promise<User>;
    static registerUser(email: string, password: string, name: string): Promise<User>;
    static login(email: string, password: string): Promise<User>;
    static register(email: string, password: string, name: string): Promise<User>;
    static updateProfile(user: User): Promise<User>;
    static logout(): Promise<void>;
    static restoreSession(): Promise<User | null>;
    static isAuthenticated(): boolean;
    static getCurrentUser(): User | null;
    private static setAuthState;
    private static clearAuthState;
    private static generateUserId;
}
//# sourceMappingURL=AuthService.d.ts.map