"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = exports.AuthProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const auth_1 = require("../types/auth");
const AuthContext = (0, react_1.createContext)(undefined);
const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = (0, react_1.useState)({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
    });
    const login = (0, react_1.useCallback)(async (data) => {
        setAuthState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const response = await mockAuth.login(data);
            const { token, user } = response;
            setAuthState(prev => ({
                ...prev,
                isAuthenticated: true,
                user,
                token,
                loading: false,
                error: null,
            }));
        }
        catch (error) {
            setAuthState(prev => ({
                ...prev,
                loading: false,
                error: error.response?.data?.message || 'Login failed',
            }));
        }
    }, [mockAuth]);
    const logout = (0, react_1.useCallback)(() => {
        setAuthState(prev => ({
            ...prev,
            isAuthenticated: false,
            user: null,
            token: null,
            error: null,
        }));
    }, []);
    const updateUser = (0, react_1.useCallback)((user) => {
        setAuthState(prev => ({
            ...prev,
            user,
            token: user?.id,
            isAuthenticated: true,
        }));
    }, []);
    const value = {
        login,
        logout,
        updateUser,
        authState,
        login: () => login(authState.authState),
    };
    return (0, jsx_runtime_1.jsx)(AuthContext.Provider, { value: value, children: children });
};
exports.AuthProvider = AuthProvider;
const useAuth = () => {
    const context = (0, react_1.useContext)(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
exports.useAuth = useAuth;
exports.default = AuthContext;
//# sourceMappingURL=AuthContext.js.map