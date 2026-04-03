import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Navigation } from '../components/Navigation';
export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Use the refactored auth hook
    const { login, loginSuccess, loginFailure, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    // Get the return URL from state, default to dashboard
    const from = location.state?.from?.pathname || '/dashboard';
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Validate input
            if (!email || !password) {
                return;
            }
            // Attempt login
            await login({ email, password });
            // Check login result
            if (loginSuccess) {
                navigate(from, { replace: true });
            }
            // If loginFailure is true, stay on page with error shown
        }
        catch {
            // Error is already handled by the hook
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "container", children: [_jsx(Navigation, {}), _jsxs("div", { className: "card form-container", children: [_jsx("h1", { className: "form-title", children: "Welcome back" }), _jsx("p", { className: "form-subtitle", children: "Sign in to your OmniCoder account" }), _jsx("div", { className: "error", children: loginFailure && 'Invalid email or password' }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", type: "email", placeholder: "Enter your email", value: email, onChange: (e) => setEmail(e.target.value), disabled: isSubmitting || isLoading, required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", type: "password", placeholder: "Enter your password", value: password, onChange: (e) => setPassword(e.target.value), disabled: isSubmitting || isLoading, required: true })] }), _jsx("button", { type: "submit", className: "btn btn-primary", disabled: isSubmitting || isLoading, children: isLoading ? 'Signing in...' : 'Sign in' })] }), _jsx("div", { style: { marginTop: '20px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }, children: "Demo: admin@omnicoder.com / password123" })] })] }));
}
//# sourceMappingURL=Login.js.map