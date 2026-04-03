/**
 * Utility to clear authentication state
 */
export const clearAuth = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('targetRoute');
        console.log('Auth cleared successfully');
    }
};
export default clearAuth;
//# sourceMappingURL=clearAuth.js.map