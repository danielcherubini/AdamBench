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
exports.useAuth = exports.AuthProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
// Simple auth utilities using localStorage
const STORAGE_KEY = 'user';
const PROFILE_KEY = 'profile';
const getUser = () => localStorage.getItem(STORAGE_KEY);
const setUser = (username) => {
    if (username)
        localStorage.setItem(STORAGE_KEY, username);
    else
        localStorage.removeItem(STORAGE_KEY);
};
const getProfile = () => {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
};
const setProfile = (profile) => {
    if (profile)
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    else
        localStorage.removeItem(PROFILE_KEY);
};
const authUpdateProfile = (updates) => {
    const current = getProfile() || { name: '', email: '' };
    const newProfile = { ...current, ...updates };
    setProfile(newProfile);
};
const authLogin = async (username, password) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (username && password) {
                setUser(username);
                resolve(true);
            }
            else {
                resolve(false);
            }
        }, 500);
    });
};
const authLogout = () => {
    setUser(null);
    setProfile(null);
};
const AuthContext = (0, react_1.createContext)(undefined);
const AuthProvider = ({ children }) => {
    // Initialise state from the service (which reads localStorage)
    const [user, setUser] = (0, react_1.useState)(getUser());
    const [profile, setProfile] = (0, react_1.useState)(getProfile());
    const login = async (username, password) => {
        const success = await authLogin(username, password);
        if (success)
            setUser(username);
        return success;
    };
    const logout = () => {
        authLogout();
        setUser(null);
        setProfile(null);
    };
    const updateProfile = (data) => {
        authUpdateProfile(data);
        setProfile(data);
    };
    return ((0, jsx_runtime_1.jsx)(AuthContext.Provider, { value: { user, profile, login, logout, updateProfile }, children: children }));
};
exports.AuthProvider = AuthProvider;
const useAuth = () => {
    const context = (0, react_1.useContext)(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
exports.useAuth = useAuth;
//# sourceMappingURL=AuthContext.js.map