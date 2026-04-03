// Simple auth utilities for testing
export const validateLogin = (email, password) => {
    if (!email || !password) {
        return { valid: false, error: 'Email and password are required' };
    }
    if (password.length < 4) {
        return { valid: false, error: 'Password must be at least 4 characters' };
    }
    return { valid: true };
};
export const generateToken = (userId, email) => {
    const tokenData = {
        userId,
        email,
        timestamp: Date.now(),
    };
    return btoa(JSON.stringify(tokenData));
};
export const validateToken = (token) => {
    try {
        const decoded = atob(token);
        const data = JSON.parse(decoded);
        return !!data.userId && !!data.email && !!data.timestamp;
    }
    catch {
        return false;
    }
};
// Export for testing
export const __test__ = {
    validateLogin,
    generateToken,
    validateToken,
};
//# sourceMappingURL=auth.js.map