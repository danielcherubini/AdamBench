"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthActions = exports.useAuthState = exports.useAuth = exports.AuthProvider = exports.AuthService = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const types_1 = require("../types");
// Create the context
const AuthContext = (0, react_1.createContext)(undefined);
// Authentication service class for better modularity
class AuthService {
    static STORAGE_KEY = 'user';
    static async performLogin(email, password) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        // Fake authentication logic - in real app this would be an API call
        if (email === 'user@example.com' && password === 'password') {
            const user = {
                id: 1,
                email,
                name: 'John Doe'
            };
            return { success: true, user };
        }
        return {
            success: false,
            error: 'Invalid email or password'
        };
    }
    static async updateUser(user) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 300));
        // In a real app, this would be an API call to update user data
        // For now, we'll just save to storage
        this.saveUserToStorage(user);
    }
    static saveUserToStorage(user) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    }
    static getUserFromStorage() {
        const userStr = localStorage.getItem(this.STORAGE_KEY);
        return userStr ? JSON.parse(userStr) : null;
    }
    static clearUserFromStorage() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}
exports.AuthService = AuthService;
// AuthProvider component
const AuthProvider = ({ children }) => {
    const [state, setState] = (0, react_1.useState)({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
    });
    // Initialize auth state from storage
    (0, react_1.useEffect)(() => {
        const storedUser = AuthService.getUserFromStorage();
        if (storedUser) {
            setState(prev => ({
                ...prev,
                user: storedUser,
                isAuthenticated: true
            }));
        }
    }, []);
    const login = async (email, password) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const result = await AuthService.performLogin(email, password);
            if (result.success && result.user) {
                AuthService.saveUserToStorage(result.user);
                setState({
                    user: result.user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });
                return true;
            }
            else {
                setState({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: result.error || 'Login failed'
                });
                return false;
            }
        }
        catch (error) {
            setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: 'An unexpected error occurred'
            });
            return false;
        }
    };
    const logout = () => {
        AuthService.clearUserFromStorage();
        setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
        });
    };
    const updateUser = async (user) => {
        try {
            await AuthService.updateUser(user);
            setState(prev => ({
                ...prev,
                user
            }));
        }
        catch (error) {
            setState(prev => ({
                ...prev,
                error: 'Failed to update user profile'
            }));
        }
    };
    const actions = {
        login,
        logout,
        updateUser
    };
    return ((0, jsx_runtime_1.jsx)(AuthContext.Provider, { value: { state, actions }, children: children }));
};
exports.AuthProvider = AuthProvider;
// Custom hook for easier access to auth context
const useAuth = () => {
    const context = (0, react_1.useContext)(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
exports.useAuth = useAuth;
// Hook for just the auth state
const useAuthState = () => {
    const { state } = (0, exports.useAuth)();
    return state;
};
exports.useAuthState = useAuthState;
// Hook for just the auth actions
const useAuthActions = () => {
    const { actions } = (0, exports.useAuth)();
    return actions;
};
exports.useAuthActions = useAuthActions;
//# sourceMappingURL=authService.js.map