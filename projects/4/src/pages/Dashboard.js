"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const AuthContext_1 = require("../context/AuthContext");
const Dashboard = () => {
    const { user, logout } = (0, AuthContext_1.useAuth)();
    return ((0, jsx_runtime_1.jsxs)("div", { className: "dashboard", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Dashboard" }), user && (0, jsx_runtime_1.jsxs)("p", { children: ["Welcome, ", user.name, "!"] }), (0, jsx_runtime_1.jsx)("button", { onClick: logout, children: "Logout" })] }));
};
exports.default = Dashboard;
//# sourceMappingURL=Dashboard.js.map