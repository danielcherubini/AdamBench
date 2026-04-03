import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const DEMO_CREDENTIALS = {
    user: { email: 'user@example.com', password: 'password123' },
    admin: { email: 'admin@example.com', password: 'admin123' },
};
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { login, error, isAuthenticated } = useAuth();
    useEffect(() => {
        if (isAuthenticated)
            navigate('/dashboard');
    }, [isAuthenticated, navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await login(email, password);
        }
        catch {
            // Error handled by auth context
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const fillDemo = (type) => {
        const creds = DEMO_CREDENTIALS[type];
        setEmail(creds.email);
        setPassword(creds.password);
    };
    return (_jsx("div", { className: "login-container", children: _jsxs("div", { className: "login-card", children: [_jsx("h1", { children: "Welcome Back" }), _jsx("p", { className: "subtitle", children: "Sign in to your account" }), _jsxs("form", { onSubmit: handleSubmit, children: [error && _jsx("div", { className: "error-message", children: error.message }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { type: "email", id: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Enter your email", required: true, disabled: isSubmitting })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { type: "password", id: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Enter your password", required: true, disabled: isSubmitting })] }), _jsx("button", { type: "submit", className: "submit-btn", disabled: isSubmitting, children: isSubmitting ? 'Signing in...' : 'Sign In' })] }), _jsxs("div", { className: "demo-credentials", children: [_jsx("p", { children: "Demo Credentials:" }), _jsxs("div", { className: "demo-buttons", children: [_jsx("button", { type: "button", onClick: () => fillDemo('user'), className: "demo-btn", children: "User" }), _jsx("button", { type: "button", onClick: () => fillDemo('admin'), className: "demo-btn", children: "Admin" })] }), _jsxs("p", { className: "hint", children: ["User: user@example.com / password123", _jsx("br", {}), "Admin: admin@example.com / admin123"] })] })] }) }));
};
export default Login;
//# sourceMappingURL=Login.js.map