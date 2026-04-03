"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const AuthContext_1 = require("../context/AuthContext");
const react_router_dom_1 = require("react-router-dom");
const DashboardPage = () => {
    const { user, logout } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.container, children: [(0, jsx_runtime_1.jsx)("h1", { children: "Dashboard" }), (0, jsx_runtime_1.jsxs)("p", { children: ["Welcome, ", user, "!"] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleLogout, style: styles.button, children: "Logout" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/profile'), style: styles.button, children: "Edit Profile" })] }));
};
const styles = {
    container: {
        padding: '20px',
    },
    button: {
        padding: '8px 12px',
        fontSize: '1rem',
        cursor: 'pointer',
    },
};
exports.default = DashboardPage;
//# sourceMappingURL=DashboardPage.js.map