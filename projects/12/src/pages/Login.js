"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../context/AuthContext");
const Login = () => {
    const [username, setUsername] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const navigate = (0, react_router_dom_1.useNavigate)();
    const location = (0, react_router_dom_1.useLocation)();
    const { login } = (0, AuthContext_1.useAuth)();
    const from = location.state?.from?.pathname || '/dashboard';
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await login(username, password);
            navigate(from, { replace: true });
        }
        catch (err) {
            setError('Login failed');
        }
        finally {
            setLoading(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: { maxWidth: 400, margin: 'auto', padding: 20 }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Login" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Username" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: username, onChange: (e) => setUsername(e.target.value), required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Password" }), (0, jsx_runtime_1.jsx)("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: loading, style: { marginTop: 10 }, children: loading ? 'Logging in...' : 'Login' }), error && (0, jsx_runtime_1.jsx)("p", { style: { color: 'red' }, children: error })] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Want to try a simple game? ", (0, jsx_runtime_1.jsx)("a", { href: "/snake", children: "Snake" })] })] }));
};
exports.default = Login;
//# sourceMappingURL=Login.js.map