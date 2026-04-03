import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
export const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setErrors(['Email and password are required']);
            return;
        }
        setIsSubmitting(true);
        setErrors([]);
        try {
            const response = await login({ email, password });
            if (response.success) {
                navigate('/dashboard');
            }
            else {
                setErrors([response.error || 'Login failed']);
            }
        }
        catch (error) {
            setErrors(['Login failed. Please try again.']);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDemoLogin = (email, password) => {
        setEmail(email);
        setPassword(password);
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Sign in to your account" }), _jsxs("div", { className: "mt-2 text-center", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Test accounts:" }), _jsxs("div", { className: "mt-2 space-y-1", children: [_jsx("button", { type: "button", onClick: () => handleDemoLogin('user@example.com', 'password'), className: "text-xs text-indigo-600 hover:text-indigo-500", children: "Demo: user@example.com / password" }), _jsx("br", {}), _jsx("button", { type: "button", onClick: () => handleDemoLogin('admin@example.com', 'admin123'), className: "text-xs text-indigo-600 hover:text-indigo-500", children: "Demo: admin@example.com / admin123" })] })] })] }), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleLogin, children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email address" }), _jsx("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, className: "mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm", placeholder: "Email address", value: email, onChange: (e) => setEmail(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password" }), _jsx("input", { id: "password", name: "password", type: "password", autoComplete: "current-password", required: true, className: "mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value) })] })] }), errors.length > 0 && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md relative", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-red-400", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }), _jsxs("div", { className: "ml-3", children: [_jsx("h3", { className: "text-sm font-medium", children: "Login failed" }), _jsx("div", { className: "mt-2 text-sm", children: _jsx("ul", { className: "list-disc list-inside space-y-1", children: errors.map((error, index) => (_jsx("li", { children: error }, index))) }) })] })] }) })), _jsx("div", { children: _jsx("button", { type: "submit", disabled: isSubmitting, className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed", children: isSubmitting ? (_jsxs("div", { className: "flex items-center", children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-3 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Signing in..."] })) : ('Sign in') }) })] })] }) }));
};
//# sourceMappingURL=LoginPage.js.map