"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRouteService = void 0;
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../context/AuthContext");
const auth_1 = require("../types/auth");
exports.protectedRouteService = {
    checkAuth: async () => {
        const { authState } = (0, AuthContext_1.useAuth)();
        if (authState.isAuthenticated && authState.user) {
            return { isAuthenticated: true, user: authState.user, role: authState.user.role };
        }
        else {
            const navigate = (0, react_router_dom_1.useNavigate)();
            const location = (0, react_router_dom_1.useLocation)();
            if (authState.isAuthenticated) {
                navigate('/dashboard', { replace: true });
            }
            else {
                navigate('/login', { replace: true });
            }
            return {
                isAuthenticated: false,
                user: null,
                role: 'user',
            };
        }
    },
    validateAuth: async () => {
        const { authState } = (0, AuthContext_1.useAuth)();
        return authState.isAuthenticated && authState.user;
    },
};
//# sourceMappingURL=protectedRouteService.js.map