import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
const LoginPage = () => {
    const navigate = useNavigate();
    const { login, loading } = useAuth();
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const onSubmit = async (data) => {
        setError('');
        const success = await login(data.email, data.password);
        if (!success) {
            setError('Invalid email or password. Try admin@example.com / password123');
        }
        else {
            navigate('/dashboard');
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Sign in to your account" }), _jsxs("p", { className: "mt-2 text-center text-sm text-gray-600", children: ["Or ", _jsx("a", { href: "#", className: "font-medium text-indigo-600 hover:text-indigo-500", children: "start your 14-day free trial" })] })] }), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleSubmit(onSubmit), children: [error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm", children: error })), _jsxs("div", { className: "rounded-md shadow-sm -space-y-px", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email-address", className: "sr-only", children: "Email address" }), _jsx("input", { ...register('email', {
                                                required: 'Email address is required',
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: 'Please enter a valid email address',
                                                },
                                            }), type: "email", autoComplete: "email", className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm", placeholder: "Email address" }), errors.email && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "sr-only", children: "Password" }), _jsx("input", { ...register('password', {
                                                required: 'Password is required',
                                                minLength: {
                                                    value: 6,
                                                    message: 'Password must be at least 6 characters',
                                                },
                                            }), type: "password", autoComplete: "current-password", className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm", placeholder: "Password" }), errors.password && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.password.message }))] })] }), _jsx("div", { children: _jsx("button", { type: "submit", disabled: loading, className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? 'Signing in...' : 'Sign in' }) })] }), _jsxs("div", { className: "mt-6 bg-blue-50 border border-blue-200 rounded-md p-4", children: [_jsx("h3", { className: "text-sm font-medium text-blue-800 mb-2", children: "Demo Credentials:" }), _jsxs("ul", { className: "text-xs text-blue-700 space-y-1", children: [_jsx("li", { children: "Admin: admin@example.com / password123" }), _jsx("li", { children: "User: user@example.com / password123" })] })] })] }) }));
};
export default LoginPage;
//# sourceMappingURL=LoginPage.js.map