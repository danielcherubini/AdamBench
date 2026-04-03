"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const AuthContext_1 = require("../context/AuthContext");
const react_router_dom_1 = require("react-router-dom");
const Dashboard = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { user, logout } = (0, AuthContext_1.useAuth)();
    return ((0, jsx_runtime_1.jsxs)("div", { style: { padding: 20 }, children: [(0, jsx_runtime_1.jsx)("h1", { children: "Dashboard" }), (0, jsx_runtime_1.jsxs)("p", { children: ["Welcome, ", user?.name, "!"] }), (0, jsx_runtime_1.jsx)("button", { onClick: logout, children: "Logout" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/profile'), style: { marginLeft: 10 }, children: "Profile" })] }));
};
exports.default = Dashboard;
//# sourceMappingURL=Dashboard.js.map