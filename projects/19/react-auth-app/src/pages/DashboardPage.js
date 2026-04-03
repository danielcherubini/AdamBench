"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const authService_1 = require("../services/authService");
require("../styles/DashboardPage.css");
const DashboardPage = () => {
    const { user } = (0, authService_1.useAuthState)();
    const { logout } = (0, authService_1.useAuthActions)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "dashboard-container", children: [(0, jsx_runtime_1.jsxs)("header", { className: "dashboard-header", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Dashboard" }), (0, jsx_runtime_1.jsx)("button", { className: "logout-button", onClick: handleLogout, children: "Logout" })] }), (0, jsx_runtime_1.jsxs)("main", { className: "dashboard-main", children: [(0, jsx_runtime_1.jsxs)("div", { className: "welcome-section", children: [(0, jsx_runtime_1.jsxs)("h2", { children: ["Welcome, ", user?.name || 'User', "!"] }), (0, jsx_runtime_1.jsx)("p", { children: "You are successfully logged in." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "dashboard-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "card", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Profile Information" }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Email:" }), " ", user?.email] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Name:" }), " ", user?.name] }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/profile", className: "profile-link", children: "View Profile" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "card", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Dashboard Features" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "View your profile information" }), (0, jsx_runtime_1.jsx)("li", { children: "Manage your account settings" }), (0, jsx_runtime_1.jsx)("li", { children: "Access protected content" }), (0, jsx_runtime_1.jsx)("li", { children: "View your recent activity" })] })] })] })] })] }));
};
exports.default = DashboardPage;
//# sourceMappingURL=DashboardPage.js.map