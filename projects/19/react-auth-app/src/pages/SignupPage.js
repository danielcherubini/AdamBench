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
require("../styles/SignupPage.css");
const SignupPage = () => {
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)('');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        // Simple validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }
        // In a real app, this would be an API call
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            // For demo purposes, we'll just redirect to login
            navigate('/login');
        }
        catch (err) {
            setError('An error occurred during signup');
        }
        finally {
            setIsLoading(false);
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "signup-container", children: (0, jsx_runtime_1.jsxs)("form", { className: "signup-form", onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Sign Up" }), error && (0, jsx_runtime_1.jsx)("div", { className: "error-message", children: error }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "signup-email", children: "Email:" }), (0, jsx_runtime_1.jsx)("input", { type: "email", id: "signup-email", value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "signup-password", children: "Password:" }), (0, jsx_runtime_1.jsx)("input", { type: "password", id: "signup-password", value: password, onChange: (e) => setPassword(e.target.value), required: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "confirm-password", children: "Confirm Password:" }), (0, jsx_runtime_1.jsx)("input", { type: "password", id: "confirm-password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), required: true })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: isLoading, children: isLoading ? 'Creating Account...' : 'Sign Up' }), (0, jsx_runtime_1.jsxs)("p", { className: "login-link", children: ["Already have an account? ", (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/login", children: "Login" })] }), (0, jsx_runtime_1.jsx)("p", { className: "game-link", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/snake", children: "Play Snake Game (Unauthenticated)" }) })] }) }));
};
exports.default = SignupPage;
//# sourceMappingURL=SignupPage.js.map