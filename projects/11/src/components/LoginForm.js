import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { AuthCredentials } from '../types';
const LoginForm = ({ onLogin, isLoading = false }) => {
    const [credentials, setCredentials] = useState({
        email: 'user@example.com',
        password: 'password123',
    });
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await onLogin(credentials.email, credentials.password);
            if (response && !response.success) {
                setError(response.error || 'Invalid credentials');
            }
        }
        catch (err) {
            setError('An error occurred during login');
        }
    };
    const handleDemoLogin = () => {
        setCredentials({
            email: 'user@example.com',
            password: 'password123',
        });
    };
    const handleInputChange = (field) => (e) => {
        setCredentials((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4", children: _jsxs("div", { className: "max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold text-center text-gray-900", children: "Welcome Back" }), _jsx("p", { className: "mt-2 text-center text-sm text-gray-600", children: "Sign in to your account" })] }), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleSubmit, children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-1", children: "Email Address" }), _jsx("input", { id: "email", type: "email", required: true, className: "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all", placeholder: "Enter your email", value: credentials.email, onChange: handleInputChange('email') })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-1", children: "Password" }), _jsx("input", { id: "password", type: "password", required: true, className: "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all", placeholder: "Enter your password", value: credentials.password, onChange: handleInputChange('password') })] })] }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm", children: error })), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: isLoading ? 'Signing in...' : 'Sign In' })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Demo credentials:" }), _jsx("p", { className: "text-xs text-gray-500", children: "user@example.com / any 4+ characters" }), _jsx("button", { type: "button", onClick: handleDemoLogin, className: "mt-2 text-sm text-blue-600 hover:text-blue-800", children: "Use demo credentials" })] })] }) }));
};
export default LoginForm;
//# sourceMappingURL=LoginForm.js.map