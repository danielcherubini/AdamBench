import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../Layout';
import { useAuth } from '../auth';
export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname ?? '/dashboard';
    if (isAuthenticated) {
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await login({ email, password });
            navigate(from, { replace: true });
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs(Layout, { children: [_jsx("h1", { children: "Login" }), _jsx("p", { className: "muted", children: "Use any email and a password with at least 4 characters." }), _jsxs("form", { onSubmit: handleSubmit, className: "form-stack", children: [_jsxs("label", { children: ["Email", _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@example.com", autoComplete: "email", required: true })] }), _jsxs("label", { children: ["Password", _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022", autoComplete: "current-password", required: true })] }), error && _jsx("p", { className: "error", children: error }), _jsx("button", { type: "submit", disabled: isSubmitting, children: isSubmitting ? 'Signing in...' : 'Sign in' })] }), _jsxs("p", { className: "muted small", children: ["This is fake authentication for demo purposes. Try the public ", _jsx(Link, { to: "/snake", children: "snake game" }), ' ', "or go to ", _jsx(Link, { to: "/dashboard", children: "dashboard" }), " to see route protection."] })] }));
};
//# sourceMappingURL=LoginPage.js.map