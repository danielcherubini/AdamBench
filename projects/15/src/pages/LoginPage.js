import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';
    // Simple email validation
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    // Check if email is already registered (only in register mode)
    const checkEmailAvailability = async () => {
        if (isRegistering) {
            setIsCheckingEmail(true);
            try {
                // Mock check - always allow registration
            }
            catch {
                setError('Failed to check email availability');
            }
            finally {
                setIsCheckingEmail(false);
            }
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error)
            setError(null);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }
        if (!validateEmail(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }
        if (isRegistering) {
            await checkEmailAvailability();
            if (error)
                return;
        }
        try {
            if (isRegistering) {
                // Mock registration
                await login(formData.email, formData.password);
            }
            else {
                // Mock login
                await login(formData.email);
            }
            navigate(from, { replace: true });
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };
    const toggleAuthMode = () => {
        setError(null);
        setFormData({ email: '', password: '' });
        setIsRegistering(!isRegistering);
    };
    if (isLoading) {
        return _jsxs("div", { className: "auth-loading", children: [_jsx("div", { className: "spinner" }), _jsx("p", { children: "Loading..." })] });
    }
    return (_jsx("div", { className: "login-page", children: _jsx("div", { className: "login-container", children: _jsxs("div", { className: "login-card", children: [_jsx("h1", { children: isRegistering ? 'Create Account' : 'Welcome Back' }), _jsx("p", { children: isRegistering ? 'Join us today to get started!' : 'Sign in to your account' }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", name: "email", type: "email", value: formData.email, onChange: handleInputChange, placeholder: "you@example.com", required: true, disabled: isCheckingEmail }), isCheckingEmail && (_jsx("span", { className: "loading-indicator", children: "Checking..." }))] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", name: "password", type: "password", value: formData.password, onChange: handleInputChange, placeholder: isRegistering ? 'Create a password' : 'Enter password', required: true, minLength: isRegistering ? 6 : 4 })] }), error && _jsx("div", { className: "error-message", children: error }), _jsx("button", { type: "submit", className: "submit-btn", disabled: isCheckingEmail, children: isRegistering ? 'Create Account' : 'Sign In' })] }), _jsxs("p", { className: "toggle-auth", children: [isRegistering ? "Already have an account? " : "Don't have an account? ", _jsx("button", { type: "button", onClick: toggleAuthMode, className: "toggle-btn", children: isRegistering ? 'Sign In' : 'Sign Up' })] })] }) }) }));
};
//# sourceMappingURL=LoginPage.js.map