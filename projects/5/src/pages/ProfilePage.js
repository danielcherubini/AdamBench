import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types/auth';
const ProfilePage = () => {
    const { user, login } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
        setSuccess(false);
    };
    const handleSave = async (e) => {
        e.preventDefault();
        if (!user)
            return;
        if (!formData.name.trim() || !formData.email.trim()) {
            setError('Name and email are required');
            return;
        }
        if (!isValidEmail(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const updatedUser = {
                ...user,
                name: formData.name.trim(),
                email: formData.email.trim()
            };
            localStorage.setItem('auth_user', JSON.stringify(updatedUser));
            await login({
                email: formData.email.trim(),
                password: 'password'
            });
            setSuccess(true);
            setIsEditing(false);
            setTimeout(() => setSuccess(false), 3000);
        }
        catch (err) {
            setError('Failed to update profile. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email
            });
        }
        setIsEditing(false);
        setError(null);
        setSuccess(false);
    };
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    if (!user) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "bg-white p-8 rounded-lg shadow-md", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Profile" }), _jsx("p", { className: "text-gray-600", children: "Please log in to view your profile." })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "max-w-3xl mx-auto", children: _jsx("div", { className: "bg-white shadow-xl rounded-lg overflow-hidden", children: _jsxs("div", { className: "px-6 py-8", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-8 text-center", children: "User Profile" }), success && (_jsx("div", { className: "mb-6 p-4 bg-green-50 border border-green-200 rounded-md", children: _jsx("p", { className: "text-green-800 text-center", children: "Profile updated successfully!" }) })), error && (_jsx("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-md", children: _jsx("p", { className: "text-red-800 text-center", children: error }) })), _jsxs("div", { className: "flex items-center mb-8 p-6 bg-gray-50 rounded-lg", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4", children: user.name.charAt(0).toUpperCase() }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900", children: user.name }), _jsx("p", { className: "text-gray-600", children: user.email })] })] }), isEditing ? (_jsxs("form", { onSubmit: handleSave, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700 mb-2", children: "Full Name" }), _jsx("input", { type: "text", id: "name", name: "name", value: formData.name, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500", placeholder: "Enter your full name", disabled: isLoading })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-2", children: "Email Address" }), _jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500", placeholder: "Enter your email address", disabled: isLoading })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsx("button", { type: "button", onClick: handleCancel, disabled: isLoading, className: "flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isLoading, className: "flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50", children: isLoading ? 'Saving...' : 'Save Changes' })] })] })) : (_jsx("div", { className: "text-center", children: _jsx("button", { onClick: () => setIsEditing(true), className: "px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: "Edit Profile" }) })), _jsxs("div", { className: "mt-8 pt-8 border-t border-gray-200", children: [_jsx("h4", { className: "text-lg font-medium text-gray-900 mb-4", children: "Account Information" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm font-medium text-gray-500", children: "User ID:" }), _jsx("span", { className: "text-sm text-gray-900 font-mono", children: user.id })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm font-medium text-gray-500", children: "Member Since:" }), _jsx("span", { className: "text-sm text-gray-900", children: "January 2024" })] })] })] })] }) }) }) }));
};
export { ProfilePage };
//# sourceMappingURL=ProfilePage.js.map