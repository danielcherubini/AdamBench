import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth';
export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const ok = await login(email, password);
        if (ok)
            navigate(from, { replace: true });
        else
            setError('Invalid email or password');
        setLoading(false);
    };
    return (_jsx("div", { className: "login-container", children: _jsxs("div", { className: "login-card", children: [_jsx("h1", { children: "Welcome Back" }), _jsx("p", { className: "login-subtitle", children: "Sign in to your account" }), error && _jsx("div", { className: "error-message", children: error }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, disabled: loading })] }), _jsx("button", { type: "submit", className: "login-button", disabled: loading, children: loading ? 'Signing in...' : 'Sign In' })] }), _jsxs("div", { className: "demo-credentials", children: [_jsxs("p", { children: ["Demo: ", _jsx("code", { children: "admin@example.com / admin123" })] }), _jsx("a", { href: "/snake", className: "snake-link", children: "\uD83D\uDC0D Play Snake" })] })] }) }));
}
//# sourceMappingURL=Login.js.map