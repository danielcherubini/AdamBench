export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}
export declare const saveSession: (user: User, token: string) => void;
export declare const getCurrentUser: () => User | null;
export declare const getCurrentToken: () => string | null;
export declare const clearSession: () => void;
export declare const isAuthenticated: () => boolean;
export declare const __test__: {
    saveSession: (user: User, token: string) => void;
    getCurrentUser: () => User | null;
    getCurrentToken: () => string | null;
    clearSession: () => void;
    isAuthenticated: () => boolean;
};
//# sourceMappingURL=session.d.ts.map