import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
export const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useLogin();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await login(formData);
            navigate('/dashboard');
        }
        catch (err) {
            setError({ message: err.message, field: undefined });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const demoAccounts = [
        { email: 'admin@example.com', password: 'password', name: 'Admin User' },
        { email: 'user@example.com', password: 'password', name: 'Regular User' },
    ];
    return (_jsx("div", { className: "login-page", children: _jsxs("div", { className: "login-container", children: [_jsxs("div", { className: "login-header", children: [_jsx("h1", { children: "Welcome Back" }), _jsx("p", { children: "Sign in to your account to continue" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "login-form", noValidate: true, children: [error && (_jsxs("div", { className: "error-message", children: [_jsx("span", { className: "error-icon" }), error.message] })), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleChange, placeholder: "Enter your email", autoComplete: "email" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { type: "password", id: "password", name: "password", value: formData.password, onChange: handleChange, placeholder: "Enter your password", autoComplete: "current-password" })] }), _jsx("button", { type: "submit", className: "login-btn", disabled: isLoading, children: isLoading ? 'Signing in...' : 'Sign In' })] }), _jsxs("div", { className: "login-footer", children: [_jsxs("p", { children: ["Demo accounts:", _jsx("ul", { children: demoAccounts.map((account) => (_jsxs("li", { children: [account.name, " (", account.email, ")"] }, account.email))) })] }), _jsx(Link, { to: "/", className: "home-link", children: "\u2190 Back to Home" })] })] }) }));
};
//# sourceMappingURL=LoginPage.js.map