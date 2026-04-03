import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';
    // Redirect if already authenticated - use useEffect to avoid render-time navigation
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate, from]);
    // Show loading while checking auth state
    if (isLoading) {
        return (_jsx("div", { className: "login-page", children: _jsx("div", { className: "loading-container", children: _jsx("div", { className: "loading-spinner" }) }) }));
    }
    // Don't render form if redirecting
    if (isAuthenticated) {
        return null;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        setIsSubmitting(true);
        try {
            await login({ email, password });
            navigate(from, { replace: true });
        }
        catch {
            // Error is handled by AuthContext
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleInputChange = (setter) => (e) => {
        if (error)
            clearError();
        setter(e.target.value);
    };
    return (_jsx("div", { className: "login-page", children: _jsxs("div", { className: "login-card", children: [_jsxs("div", { className: "login-header", children: [_jsx("h1", { children: "Welcome Back" }), _jsx("p", { children: "Sign in to your account" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "login-form", noValidate: true, children: [error && (_jsx("div", { className: "error-message", role: "alert", children: error })), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", name: "email", type: "email", value: email, onChange: handleInputChange(setEmail), placeholder: "Enter your email", autoComplete: "email", required: true, disabled: isSubmitting })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", name: "password", type: "password", value: password, onChange: handleInputChange(setPassword), placeholder: "Enter your password", autoComplete: "current-password", required: true, disabled: isSubmitting })] }), _jsx("button", { type: "submit", className: "login-button", disabled: isSubmitting || isLoading, children: isSubmitting ? 'Signing in...' : 'Sign In' })] }), _jsxs("div", { className: "demo-credentials", children: [_jsx("p", { children: _jsx("strong", { children: "Demo Credentials:" }) }), _jsx("p", { children: "Email: admin@example.com" }), _jsx("p", { children: "Password: admin123" })] })] }) }));
}
//# sourceMappingURL=Login.js.map