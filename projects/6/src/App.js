"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const LoginPage_1 = __importDefault(require("./pages/LoginPage"));
const DashboardPage_1 = __importDefault(require("./pages/DashboardPage"));
const ProfilePage_1 = __importDefault(require("./pages/ProfilePage"));
const AuthContext_1 = require("./context/AuthContext");
const SnakeGamePage_1 = __importDefault(require("./pages/SnakeGamePage"));
const PrivateRoute = ({ children }) => {
    const { user } = (0, AuthContext_1.useAuth)();
    return user ? children : (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/login", replace: true });
};
const App = () => {
    return ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/login", element: (0, jsx_runtime_1.jsx)(LoginPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/dashboard", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(DashboardPage_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/profile", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(ProfilePage_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/snake", element: (0, jsx_runtime_1.jsx)(SnakeGamePage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "*", element: (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/login", replace: true }) })] }));
};
exports.default = App;
//# sourceMappingURL=App.js.map