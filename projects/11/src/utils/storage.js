// Storage utilities - using sessionStorage directly for simplicity
export const getStorage = (key) => {
    return sessionStorage.getItem(key);
};
export const setStorage = (key, value) => {
    sessionStorage.setItem(key, value);
};
export const removeStorage = (key) => {
    sessionStorage.removeItem(key);
};
// Export for testing
export const __test__ = {
    getStorage,
    setStorage,
    removeStorage,
};
//# sourceMappingURL=storage.js.map