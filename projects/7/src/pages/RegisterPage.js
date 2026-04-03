"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const RegisterPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    useEffect(() => {
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
    return ((0, jsx_runtime_1.jsx)("div", { className: "register-page", children: (0, jsx_runtime_1.jsxs)("div", { className: "register-card", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Create Account" }), (0, jsx_runtime_1.jsx)("p", { children: "Sign up for a new account" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "username", children: "Username" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "username", name: "username", value: formData.username, onChange: handleChange, placeholder: "Choose a username", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "password", children: "Password" }), (0, jsx_runtime_1.jsx)("input", { type: "password", id: "password", name: "password", value: formData.password, onChange: handleChange, placeholder: "Create a password", required: true })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn btn-primary btn-block", children: "Sign Up" })] }), (0, jsx_runtime_1.jsx)("div", { className: "divider", children: "or" }), (0, jsx_runtime_1.jsxs)("div", { className: "social-login", children: [(0, jsx_runtime_1.jsxs)("button", { className: "btn btn-secondary btn-block", children: [(0, jsx_runtime_1.jsx)("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: (0, jsx_runtime_1.jsx)("path", { d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" }) }), "Google"] }), (0, jsx_runtime_1.jsxs)("button", { className: "btn btn-secondary btn-block", children: [(0, jsx_runtime_1.jsx)("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: (0, jsx_runtime_1.jsx)("path", { d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" }) }), "GitHub"] })] }), (0, jsx_runtime_1.jsxs)("p", { className: "login-help", children: ["Already have an account? ", (0, jsx_runtime_1.jsx)(Link, { to: "/login", children: "Sign in" })] })] }) }));
};
exports.default = RegisterPage;
//# sourceMappingURL=RegisterPage.js.map