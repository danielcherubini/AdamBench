import { User, LoginCredentials } from '../types';
const USER_DB = {
    '1': { email: 'admin@omnicoder.com', password: 'password123', name: 'Admin User' },
    '2': { email: 'user@omnicoder.com', password: 'password123', name: 'Regular User' },
    '3': { email: 'test@example.com', password: 'test123', name: 'Test User' },
};
// Configuration for storage keys
const STORAGE_KEYS = {
    USER: 'omnicoder_user',
    SESSION_ID: 'omnicoder_session',
};
// Simulate network delay (for testing, can be overridden)
const NETWORK_DELAY = 500;
// Auth error types
export var AuthError;
(function (AuthError) {
    AuthError["INVALID_CREDENTIALS"] = "Invalid credentials";
    AuthError["NETWORK_ERROR"] = "Network error";
    AuthError["SESSION_EXPIRED"] = "Session expired";
    AuthError["UNAUTHORIZED"] = "Unauthorized";
})(AuthError || (AuthError = {}));
export class AuthService {
    user = null;
    /**
     * Authenticate user with provided credentials
     */
    async login(credentials) {
        // Validate input
        if (!credentials.email || !credentials.password) {
            throw new Error(AuthError.INVALID_CREDENTIALS);
        }
        // Simulate network delay
        await this.delay(NETWORK_DELAY);
        // Find user in database
        const userRecord = this.findUserByEmail(credentials.email);
        if (!userRecord || userRecord.password !== credentials.password) {
            throw new Error(AuthError.INVALID_CREDENTIALS);
        }
        // Create user object with ID and avatar
        const userId = this.getNextUserId();
        this.user = {
            id: userId,
            email: credentials.email,
            name: userRecord.name,
            avatar: this.generateAvatar(userRecord.name),
        };
        return this.user;
    }
    /**
     * Logout current user
     */
    logout() {
        this.user = null;
    }
    /**
     * Get current user
     */
    getCurrentUser() {
        return this.user;
    }
    /**
     * Clear all session data
     */
    clearSession() {
        this.user = null;
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
    }
    /**
     * Load user from storage (for session persistence)
     */
    async loadUserFromStorage() {
        try {
            const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
            if (!storedUser) {
                return null;
            }
            const parsedUser = JSON.parse(storedUser);
            // Validate user data
            if (!parsedUser.id || !parsedUser.email || !parsedUser.name) {
                this.clearSession();
                return null;
            }
            // Validate against database (password check)
            const userRecord = this.findUserByEmail(parsedUser.email);
            if (!userRecord || userRecord.password !== parsedUser._password) {
                this.clearSession();
                return null;
            }
            // Update user with current avatar
            this.user = {
                ...parsedUser,
                avatar: this.generateAvatar(parsedUser.name),
            };
            // Remove temporary password from storage
            const userData = JSON.parse(storedUser);
            delete userData._password;
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
            return this.user;
        }
        catch (error) {
            console.error('Failed to load user from storage:', error);
            this.clearSession();
            return null;
        }
    }
    /**
     * Private: Find user by email in database
     */
    findUserByEmail(email) {
        return Object.values(USER_DB).find((u) => u.email.toLowerCase() === email.toLowerCase());
    }
    /**
     * Private: Get next available user ID
     */
    getNextUserId() {
        const existingIds = Object.keys(USER_DB);
        let id = 3;
        while (existingIds.includes(String(id))) {
            id++;
        }
        return String(id);
    }
    /**
     * Private: Generate avatar URL from name
     */
    generateAvatar(name) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0066cc&color=fff`;
    }
    /**
     * Private: Simulate network delay
     */
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
// Singleton instance
export const authService = new AuthService();
export default authService;
//# sourceMappingURL=AuthService.js.map