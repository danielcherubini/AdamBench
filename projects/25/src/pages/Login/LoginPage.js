import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context';
import styles from './Login.module.css';
export const LoginPage = () => {
    const [email, setEmail] = useState('user@example.com');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isAuthenticated, isLoading } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';
    if (isAuthenticated) {
        return _jsx(Navigate, { to: from, replace: true });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login({ email, password });
        if (success) {
            navigate(from, { replace: true });
        }
        else {
            setError('Invalid email or password');
        }
    };
    return (_jsx("div", { className: styles.container, children: _jsxs("div", { className: styles.card, children: [_jsx("h1", { className: styles.title, children: "Sign In" }), _jsx("p", { className: styles.subtitle, children: "Enter your credentials to access the dashboard" }), _jsxs("form", { onSubmit: handleSubmit, className: styles.form, children: [error && _jsx("div", { className: styles.error, children: error }), _jsxs("div", { className: styles.field, children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "user@example.com", required: true })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Enter password", required: true })] }), _jsx("button", { type: "submit", className: styles.button, disabled: isLoading, children: isLoading ? 'Signing in...' : 'Sign In' })] }), _jsxs("p", { className: styles.hint, children: ["Hint: Use ", _jsx("code", { children: "user@example.com" }), " / ", _jsx("code", { children: "password123" })] }), _jsx("div", { className: styles.divider }), _jsx("button", { type: "button", onClick: () => navigate('/snake'), className: styles.snakeLink, children: "Play Snake Game (No login required)" })] }) }));
};
//# sourceMappingURL=LoginPage.js.map