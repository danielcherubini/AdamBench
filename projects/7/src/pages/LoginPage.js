"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../context/AuthContext");
const auth_1 = require("../types/auth");
const LoginPage = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { login } = (0, AuthContext_1.useAuth)();
    const [formData, setFormData] = (0, react_1.useState)({
        username: '',
        password: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            navigate('/dashboard');
        }
        catch (error) {
            alert(error.response?.data?.message || 'Login failed');
        }
    };
    (0, react_1.useEffect)(() => {
        const handleLoginResponse = async () => {
            const credentials = { ...formData };
            // Simulate successful login
            const response = await mockAuth.login(credentials);
            setAuthState({
                isAuthenticated: true,
                user: response.user,
                token: response.token,
                loading: false,
                error: null,
            });
            navigate('/dashboard');
        };
        handleLoginResponse();
    }, [formData]);
    return ((0, jsx_runtime_1.jsx)("div", { className: "login-page", children: (0, jsx_runtime_1.jsxs)("div", { className: "login-card", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Welcome Back" }), (0, jsx_runtime_1.jsx)("p", { children: "Please enter your details to sign in" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "username", children: "Username" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "username", name: "username", value: formData.username, onChange: handleChange, placeholder: "Enter your username", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "password", children: "Password" }), (0, jsx_runtime_1.jsx)("input", { type: "password", id: "password", name: "password", value: formData.password, onChange: handleChange, placeholder: "Enter your password", required: true })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn btn-primary btn-block", children: "Sign In" })] }), (0, jsx_runtime_1.jsx)("div", { className: "divider", children: "or" }), (0, jsx_runtime_1.jsxs)("div", { className: "social-login", children: [(0, jsx_runtime_1.jsxs)("button", { className: "btn btn-secondary btn-block", children: [(0, jsx_runtime_1.jsxs)("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), (0, jsx_runtime_1.jsx)("circle", { cx: "9", cy: "7", r: "4" }), (0, jsx_runtime_1.jsx)("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }), (0, jsx_runtime_1.jsx)("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })] }), "Google"] }), (0, jsx_runtime_1.jsxs)("button", { className: "btn btn-secondary btn-block", children: [(0, jsx_runtime_1.jsx)("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: (0, jsx_runtime_1.jsx)("path", { d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" }) }), "GitHub"] })] }), (0, jsx_runtime_1.jsxs)("p", { className: "login-help", children: ["Don't have an account? ", (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/register", children: "Sign up" })] })] }) }));
};
exports.default = LoginPage;
//# sourceMappingURL=LoginPage.js.map