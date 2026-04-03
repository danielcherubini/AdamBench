"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = exports.USER_STORAGE_KEY = void 0;
const auth_1 = require("../types/auth");
exports.USER_STORAGE_KEY = 'user';
class AuthService {
    login(user) {
        localStorage.setItem(exports.USER_STORAGE_KEY, JSON.stringify(user));
    }
    logout() {
        localStorage.removeItem(exports.USER_STORAGE_KEY);
    }
    getCurrentUser() {
        const userJson = localStorage.getItem(exports.USER_STORAGE_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }
}
exports.AuthService = AuthService;
// Export a singleton instance
exports.authService = new AuthService();
//# sourceMappingURL=authService.js.map