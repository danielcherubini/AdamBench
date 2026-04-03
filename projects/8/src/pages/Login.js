import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';
export function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    if (isAuthenticated) {
        navigate('/dashboard', { replace: true });
        return null;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(username, password);
        if (!success) {
            setError('Invalid username or password');
        }
    };
    return (_jsx("div", { className: "login-container", children: _jsxs("div", { className: "login-card", children: [_jsx("h1", { children: "Welcome Back" }), _jsx("p", { className: "login-subtitle", children: "Sign in to your account" }), _jsxs("form", { onSubmit: handleSubmit, className: "login-form", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "username", children: "Username" }), _jsx("input", { id: "username", type: "text", value: username, onChange: (e) => setUsername(e.target.value), placeholder: "Enter username", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Enter password", required: true })] }), error && _jsx("div", { className: "error-message", children: error }), _jsx("button", { type: "submit", className: "login-btn", children: "Sign In" })] }), _jsxs("div", { className: "demo-credentials", children: [_jsx("p", { children: _jsx("strong", { children: "Quick Login:" }) }), _jsxs("div", { className: "demo-buttons", children: [_jsx("button", { type: "button", className: "demo-btn", onClick: () => { setUsername('admin'); setPassword('admin123'); }, children: "admin" }), _jsx("button", { type: "button", className: "demo-btn", onClick: () => { setUsername('user'); setPassword('user123'); }, children: "user" })] }), _jsxs("p", { className: "demo-creds-text", children: ["Or use: ", _jsx("code", { children: "admin/admin123" })] })] }), _jsx("div", { className: "login-footer", children: _jsx(Link, { to: "/snake", className: "snake-link", children: "\uD83D\uDC0D Play Snake Game" }) })] }) }));
}
//# sourceMappingURL=Login.js.map