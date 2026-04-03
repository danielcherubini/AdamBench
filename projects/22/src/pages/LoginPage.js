import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, error, isAuthenticated, clearError } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';
    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);
    // Clear error when form changes
    useEffect(() => {
        if (error) {
            clearError();
        }
    }, [email, password, error, clearError]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const loginError = await login({ email, password });
        if (!loginError) {
            navigate(from, { replace: true });
        }
        else {
            setIsSubmitting(false);
        }
    };
    return (_jsx("div", { style: styles.container, children: _jsxs("div", { style: styles.card, children: [_jsx("h1", { style: styles.title, children: "Welcome Back" }), _jsx("p", { style: styles.subtitle, children: "Sign in to your account" }), _jsxs("form", { onSubmit: handleSubmit, style: styles.form, children: [_jsxs("div", { style: styles.formGroup, children: [_jsx("label", { htmlFor: "email", style: styles.label, children: "Email" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), style: styles.input, placeholder: "user@example.com", required: true, disabled: isSubmitting })] }), _jsxs("div", { style: styles.formGroup, children: [_jsx("label", { htmlFor: "password", style: styles.label, children: "Password" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), style: styles.input, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true, disabled: isSubmitting })] }), error && (_jsx("div", { style: styles.errorContainer, children: _jsx("p", { style: styles.error, children: error.message }) })), _jsx("button", { type: "submit", style: styles.button, disabled: isSubmitting, children: isSubmitting ? 'Signing in...' : 'Sign In' })] }), _jsxs("div", { style: styles.hint, children: [_jsx("p", { style: styles.hintTitle, children: "Demo Credentials:" }), _jsx("p", { style: styles.hintText, children: "user@example.com / password123" }), _jsx("p", { style: styles.hintText, children: "admin@example.com / admin123" })] }), _jsx("div", { style: styles.gameLink, children: _jsx(Link, { to: "/snake-game", style: styles.gameLinkText, children: "\uD83C\uDFAE Play Snake Game (no login required)" }) })] }) }));
}
const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        margin: '0 0 8px 0',
        fontSize: '24px',
        color: '#333',
        textAlign: 'center',
    },
    subtitle: {
        margin: '0 0 24px 0',
        color: '#666',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    label: {
        fontSize: '14px',
        fontWeight: 500,
        color: '#333',
    },
    input: {
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
        outline: 'none',
    },
    errorContainer: {
        padding: '12px',
        backgroundColor: '#fdf2f2',
        borderRadius: '4px',
        border: '1px solid #fecaca',
    },
    error: {
        color: '#dc2626',
        fontSize: '14px',
        margin: '0',
        textAlign: 'center',
    },
    button: {
        padding: '12px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: 500,
        cursor: 'pointer',
        marginTop: '8px',
    },
    hint: {
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        textAlign: 'center',
    },
    hintTitle: {
        margin: '0 0 8px 0',
        fontSize: '14px',
        fontWeight: 500,
        color: '#666',
    },
    hintText: {
        margin: '4px 0',
        fontSize: '12px',
        color: '#888',
    },
    gameLink: {
        marginTop: '16px',
        textAlign: 'center',
    },
    gameLinkText: {
        color: '#3498db',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 500,
    },
};
//# sourceMappingURL=LoginPage.js.map