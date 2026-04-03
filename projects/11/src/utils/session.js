export const saveSession = (user, token) => {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    sessionStorage.setItem('authToken', token);
};
export const getCurrentUser = () => {
    const stored = sessionStorage.getItem('currentUser');
    if (!stored)
        return null;
    try {
        return JSON.parse(stored);
    }
    catch {
        return null;
    }
};
export const getCurrentToken = () => {
    return sessionStorage.getItem('authToken');
};
export const clearSession = () => {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('authToken');
};
export const isAuthenticated = () => {
    return !!getCurrentUser() && !!getCurrentToken();
};
// Export for testing
export const __test__ = {
    saveSession,
    getCurrentUser,
    getCurrentToken,
    clearSession,
    isAuthenticated,
};
//# sourceMappingURL=session.js.map