"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../context/AuthContext");
const protectedRouteService_1 = require("../services/protectedRouteService");
const auth_1 = require("../types/auth");
const ProtectedRoutePage = () => {
    const [user, setUser] = (0, react_1.useState)(null);
    const { logout, updateUser } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const location = (0, react_router_dom_1.useLocation)();
    const handleLogout = async () => {
        await protectedRouteService_1.protectedRouteService.checkAuth();
        await logout();
        navigate('/login', { replace: true });
    };
    const handleUpdateRole = async (newRole) => {
        await updateUser({
            id: '1',
            username: 'admin',
            email: 'admin@example.com',
            role: newRole,
        });
        navigate('/dashboard', { replace: true });
    };
    if (user) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "dashboard-page", children: [(0, jsx_runtime_1.jsx)("h1", { children: "User Dashboard" }), (0, jsx_runtime_1.jsxs)("p", { children: ["Logged in as: ", user.username] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleUpdateRole('user'), className: "btn btn-secondary", children: "Change to User Role" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleUpdateRole('admin'), className: "btn btn-primary", children: "Change to Admin Role" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleLogout, className: "btn btn-danger", children: "Logout" })] }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "login-page", children: (0, jsx_runtime_1.jsxs)("div", { className: "login-card", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Authentication Required" }), (0, jsx_runtime_1.jsx)("p", { children: "Please authenticate to access this page" }), (0, jsx_runtime_1.jsxs)("div", { className: "auth-form", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/login', { replace: true }), className: "btn btn-primary", children: "Login" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/register', { replace: true }), className: "btn btn-secondary", children: "Register" })] })] }) }));
};
exports.default = ProtectedRoutePage;
//# sourceMappingURL=ProtectedRoutePage.js.map