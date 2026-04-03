import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Login Page
 * Handles user authentication
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthWithNavigate } from '../context/useAuthWithNavigate';
export const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { loginWithRedirect } = useAuthWithNavigate();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError(null);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await loginWithRedirect(formData);
        }
        catch (err) {
            setError('Invalid email or password');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { style: styles.container, children: _jsxs("div", { style: styles.card, children: [_jsx("h1", { style: styles.title, children: "Welcome Back" }), _jsx("p", { style: styles.subtitle, children: "Please sign in to your account" }), error && _jsx("div", { style: styles.error, children: error }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { style: styles.formGroup, children: [_jsx("label", { style: styles.label, children: "Email" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, placeholder: "Enter your email", required: true, style: styles.input, disabled: isLoading })] }), _jsxs("div", { style: styles.formGroup, children: [_jsx("label", { style: styles.label, children: "Password" }), _jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleChange, placeholder: "Enter your password", required: true, style: styles.input, disabled: isLoading })] }), _jsx("button", { type: "submit", style: {
                                ...styles.button,
                                opacity: isLoading ? 0.6 : 1,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                            }, disabled: isLoading, children: isLoading ? 'Signing in...' : 'Sign In' })] }), _jsxs("p", { style: styles.footer, children: ["Don't have an account? ", _jsx(Link, { to: "/register", style: styles.link, children: "Sign up" })] })] }) }));
};
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '1rem',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        margin: '0 0 0.5rem 0',
        fontSize: '1.5rem',
        color: '#333',
        textAlign: 'center',
    },
    subtitle: {
        margin: '0 0 1.5rem 0',
        color: '#666',
        textAlign: 'center',
    },
    error: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '0.75rem',
        borderRadius: '4px',
        marginBottom: '1rem',
        fontSize: '0.875rem',
    },
    formGroup: {
        marginBottom: '1.5rem',
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1rem',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '0.75rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
    footer: {
        marginTop: '1.5rem',
        textAlign: 'center',
        fontSize: '0.875rem',
        color: '#666',
    },
    link: {
        color: '#007bff',
        fontWeight: '600',
    },
};
export default LoginPage;
//# sourceMappingURL=LoginPage.js.map