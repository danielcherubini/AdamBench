export declare const validateLogin: (email: string, password: string) => {
    valid: boolean;
    error?: string;
};
export declare const generateToken: (userId: string, email: string) => string;
export declare const validateToken: (token: string) => boolean;
export declare const __test__: {
    validateLogin: (email: string, password: string) => {
        valid: boolean;
        error?: string;
    };
    generateToken: (userId: string, email: string) => string;
    validateToken: (token: string) => boolean;
};
//# sourceMappingURL=auth.d.ts.map