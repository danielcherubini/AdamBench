export interface User {
    id: string;
    email: string;
    name: string;
    password: string;
}
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
export interface LoginForm {
    email: string;
    password: string;
}
export type AuthContextType = AuthState & {
    login: (formData: LoginForm) => Promise<void>;
    logout: () => void;
};
//# sourceMappingURL=index.d.ts.map