"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtectedContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../context/AuthContext");
const auth_1 = require("../types/auth");
const ProtectedContext = ({ children }) => {
    const { isAuthenticated, user, loading, error } = AuthContext_1.AuthContext;
    const navigate = (0, react_router_dom_1.useNavigate)();
    if (loading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "loading-page", children: [(0, jsx_runtime_1.jsx)("div", { className: "spinner" }), (0, jsx_runtime_1.jsx)("p", { children: "Authentication in progress..." })] }));
    }
    if (!isAuthenticated) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "error-page", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Authentication Required" }), error && (0, jsx_runtime_1.jsx)("p", { className: "error-message", children: error }), (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/login'), className: "btn btn-primary", children: "Login" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/'), className: "btn btn-secondary", children: "Go to Dashboard" })] }));
    }
    if (user) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "dashboard-page", children: [(0, jsx_runtime_1.jsxs)("h1", { children: ["Welcome, ", user.username] }), user.role === 'admin' && ((0, jsx_runtime_1.jsx)("div", { className: "admin-badge", children: "Admin Access" })), (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/logout'), className: "btn btn-danger", children: "Logout" })] }));
    }
    return children;
};
exports.ProtectedContext = ProtectedContext;
//# sourceMappingURL=ProtectedContext.js.map