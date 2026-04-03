"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const authService_1 = require("../services/authService");
require("../styles/LoginPage.css");
const LoginPage = () => {
    const [email, setEmail] = (0, react_1.useState)('user@example.com');
    const [password, setPassword] = (0, react_1.useState)('password');
    const { login } = (0, authService_1.useAuthActions)();
    const { isLoading, error } = (0, authService_1.useAuthState)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const success = await login(email, password);
            if (success) {
                navigate('/dashboard');
            }
        }
        catch (err) {
            // Error is handled in the auth service
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "login-container", children: (0, jsx_runtime_1.jsxs)("form", { className: "login-form", onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Login" }), (0, jsx_runtime_1.jsx)("p", { className: "login-instructions", children: "Use test credentials: user@example.com / password" }), error && (0, jsx_runtime_1.jsx)("div", { className: "error-message", children: error }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email", children: "Email:" }), (0, jsx_runtime_1.jsx)("input", { type: "email", id: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "password", children: "Password:" }), (0, jsx_runtime_1.jsx)("input", { type: "password", id: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: isLoading, children: isLoading ? 'Logging in...' : 'Login' }), (0, jsx_runtime_1.jsxs)("p", { className: "signup-link", children: ["Don't have an account? ", (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/signup", children: "Sign up" })] }), (0, jsx_runtime_1.jsx)("p", { className: "game-link", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/snake", children: "Play Snake Game (Unauthenticated)" }) })] }) }));
};
exports.default = LoginPage;
//# sourceMappingURL=LoginPage.js.map