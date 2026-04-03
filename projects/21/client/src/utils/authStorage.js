/**
 * Authentication Storage Module
 * Handles localStorage operations and user data storage
 * Can be easily swapped for different storage backends (API, Redis, etc.)
 */
const AUTH_STORAGE_KEY = 'auth_user';
const MOCK_USERS_KEY = 'mock_users';
// Default mock users
const DEFAULT_MOCK_USERS = {
    'admin@example.com': { id: '1', email: 'admin@example.com', name: 'Admin User', role: 'admin' },
    'user@example.com': { id: '2', email: 'user@example.com', name: 'Regular User', role: 'user' },
};
// In-memory user store (simulating database)
export const getUserStore = () => {
    if (typeof window === 'undefined') {
        return new Map(Object.entries(DEFAULT_MOCK_USERS));
    }
    const stored = localStorage.getItem(MOCK_USERS_KEY);
    if (stored) {
        try {
            const users = JSON.parse(stored);
            return new Map(Object.entries(users));
        }
        catch {
            return new Map(Object.entries(DEFAULT_MOCK_USERS));
        }
    }
    return new Map(Object.entries(DEFAULT_MOCK_USERS));
};
export const createAuthStorage = () => {
    const storage = {
        getStoredUser: () => {
            try {
                const stored = localStorage.getItem(AUTH_STORAGE_KEY);
                console.log('[authStorage] getStoredUser - localStorage.getItem(AUTH_STORAGE_KEY):', stored);
                if (stored) {
                    const user = JSON.parse(stored);
                    console.log('[authStorage] getStoredUser - Parsed user:', user);
                    return user;
                }
                return null;
            }
            catch (e) {
                console.error('[authStorage] getStoredUser - Error parsing:', e);
                return null;
            }
        },
        setStoredUser: (user) => {
            try {
                console.log('[authStorage] setStoredUser - Setting user:', user);
                if (user) {
                    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
                    console.log('[authStorage] setStoredUser - Stored successfully');
                }
                else {
                    localStorage.removeItem(AUTH_STORAGE_KEY);
                    console.log('[authStorage] setStoredUser - Removed user');
                }
            }
            catch (e) {
                console.error('[authStorage] setStoredUser - Error:', e);
            }
        },
        removeStoredUser: () => {
            console.log('[authStorage] removeStoredUser - Starting removal');
            localStorage.removeItem(AUTH_STORAGE_KEY);
            console.log('[authStorage] removeStoredUser - Removed from localStorage');
        },
        getStoredUsers: () => getUserStore(),
        setStoredUsers: (users) => {
            try {
                localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(Object.fromEntries(users)));
            }
            catch (e) {
                console.error('[authStorage] setStoredUsers - Error:', e);
            }
        },
    };
    // Add a method to clear ALL localStorage
    storage.clearAll = () => {
        console.log('[authStorage] clearAll - Starting clear');
        const keys = Object.keys(localStorage);
        console.log('[authStorage] clearAll - Keys before:', keys);
        for (const key of keys) {
            localStorage.removeItem(key);
        }
        console.log('[authStorage] clearAll - Cleared all localStorage');
    };
    return storage;
};
// Default storage instance
export const authStorage = createAuthStorage();
/**
 * Initialize mock users in localStorage if not present
 * Call this once in your app initialization
 */
export const initMockUsersIfNeeded = () => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(MOCK_USERS_KEY);
        console.log('[initMockUsersIfNeeded] stored:', stored);
        if (!stored) {
            localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(DEFAULT_MOCK_USERS));
            console.log('[initMockUsersIfNeeded] Initialized mock users');
        }
    }
};
export const clearAuth = () => {
    if (typeof window !== 'undefined') {
        console.log('[clearAuth] Starting clear');
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(MOCK_USERS_KEY);
        console.log('[clearAuth] Cleared auth');
    }
};
//# sourceMappingURL=authStorage.js.map