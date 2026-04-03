"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const Login_1 = __importDefault(require("./pages/Login"));
const SnakeGame_1 = __importDefault(require("./pages/SnakeGame"));
const Dashboard_1 = __importDefault(require("./pages/Dashboard"));
const Profile_1 = __importDefault(require("./pages/Profile"));
const ProtectedRoute_1 = __importDefault(require("./ProtectedRoute"));
const App = () => {
    return ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { replace: true, to: "/dashboard" }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/login", element: (0, jsx_runtime_1.jsx)(Login_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/snake", element: (0, jsx_runtime_1.jsx)(SnakeGame_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/dashboard", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(Dashboard_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/profile", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(Profile_1.default, {}) }) })] }));
};
exports.default = App;
//# sourceMappingURL=App.js.map