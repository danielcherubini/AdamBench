import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './LoginPage.module.css';
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: styles.container, children: _jsxs("div", { className: styles.card, children: [_jsx("h1", { className: styles.title, children: "Welcome Back" }), _jsx("p", { className: styles.subtitle, children: "Sign in to your account" }), _jsxs("form", { onSubmit: handleSubmit, className: styles.form, children: [error && _jsx("div", { className: styles.error, children: error }), _jsxs("div", { className: styles.inputGroup, children: [_jsx("label", { htmlFor: "email", className: styles.label, children: "Email" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: styles.input, placeholder: "user@example.com", required: true, disabled: isLoading })] }), _jsxs("div", { className: styles.inputGroup, children: [_jsx("label", { htmlFor: "password", className: styles.label, children: "Password" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: styles.input, placeholder: "Enter your password", required: true, disabled: isLoading })] }), _jsx("button", { type: "submit", className: styles.button, disabled: isLoading, children: isLoading ? 'Signing in...' : 'Sign In' })] }), _jsx("div", { className: styles.hint, children: _jsx("p", { children: "Try: user@example.com / password123" }) }), _jsx("div", { className: styles.snakeLink, children: _jsx("a", { href: "/snake", children: "\uD83D\uDC0D Play Snake Game" }) })] }) }));
};
export default LoginPage;
//# sourceMappingURL=LoginPage.js.map