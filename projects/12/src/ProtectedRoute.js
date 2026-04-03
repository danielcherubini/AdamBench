"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("./context/AuthContext");
const ProtectedRoute = ({ children }) => {
    const { user } = (0, AuthContext_1.useAuth)();
    const location = (0, react_router_dom_1.useLocation)();
    if (!user) {
        return (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/login", replace: true, state: { from: location } });
    }
    return children;
};
exports.default = ProtectedRoute;
//# sourceMappingURL=ProtectedRoute.js.map