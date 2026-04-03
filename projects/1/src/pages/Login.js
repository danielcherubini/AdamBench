import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (isRegistering) {
                if (!name.trim()) {
                    throw new Error('Name is required for registration');
                }
                await register(email, password, name);
            }
            else {
                await login(email, password);
            }
            navigate(from, { replace: true });
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email')
            setEmail(value);
        if (name === 'password')
            setPassword(value);
        if (name === 'name')
            setName(value);
    };
    const toggleMode = () => {
        setIsRegistering(!isRegistering);
        setError('');
    };
    return (_jsx("div", { style: styles.container, children: _jsxs("div", { style: styles.card, children: [_jsx("h1", { style: styles.title, children: isRegistering ? 'Create Account' : 'Welcome Back' }), _jsx("p", { style: styles.subtitle, children: isRegistering ? 'Sign up to get started' : 'Login to your account' }), error && _jsx("div", { style: styles.error, children: error }), _jsxs("form", { onSubmit: handleSubmit, style: styles.form, children: [isRegistering && (_jsxs("div", { style: styles.formGroup, children: [_jsx("label", { htmlFor: "name", style: styles.label, children: "Name" }), _jsx("input", { type: "text", id: "name", name: "name", value: name, onChange: handleInputChange, style: styles.input, required: true, disabled: isLoading })] })), _jsxs("div", { style: styles.formGroup, children: [_jsx("label", { htmlFor: "email", style: styles.label, children: "Email" }), _jsx("input", { type: "email", id: "email", name: "email", value: email, onChange: handleInputChange, style: styles.input, placeholder: "you@example.com", required: true, disabled: isLoading })] }), _jsxs("div", { style: styles.formGroup, children: [_jsx("label", { htmlFor: "password", style: styles.label, children: "Password" }), _jsx("input", { type: "password", id: "password", name: "password", value: password, onChange: handleInputChange, style: styles.input, placeholder: "Enter your password", required: true, disabled: isLoading })] }), _jsx("button", { type: "submit", style: styles.button, disabled: isLoading, children: isLoading ? 'Please wait...' : isRegistering ? 'Sign Up' : 'Login' })] }), _jsxs("p", { style: styles.switchText, children: [isRegistering ? 'Already have an account?' : "Don't have an account?", _jsx("button", { onClick: toggleMode, style: styles.linkButton, children: isRegistering ? 'Login' : 'Sign Up' })] }), _jsxs("div", { style: styles.demoInfo, children: [_jsx("p", { style: styles.demoText, children: _jsx("strong", { children: "Demo Credentials:" }) }), _jsxs("ul", { style: styles.demoList, children: [_jsx("li", { children: "admin@example.com / password123" }), _jsx("li", { children: "user@example.com / password123" })] })] })] }) }));
}
export default Login;
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        padding: '20px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '8px',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '24px',
        textAlign: 'center',
    },
    error: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '16px',
        fontSize: '14px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    label: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#333',
    },
    input: {
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    button: {
        padding: '12px',
        backgroundColor: '#1976d2',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    switchText: {
        marginTop: '20px',
        fontSize: '14px',
        color: '#666',
        textAlign: 'center',
    },
    linkButton: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#1976d2',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        marginLeft: '4px',
        padding: '0',
    },
    demoInfo: {
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
    },
    demoText: {
        fontSize: '12px',
        color: '#666',
        marginBottom: '8px',
    },
    demoList: {
        fontSize: '12px',
        color: '#444',
        paddingLeft: '20px',
        margin: 0,
    },
};
//# sourceMappingURL=Login.js.map