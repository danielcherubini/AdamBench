import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export const ProfilePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email
            });
        }
    }, [user]);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };
    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        if (!formData.name.trim() || !formData.email.trim()) {
            setError('Name and email are required');
            setIsSaving(false);
            return;
        }
        try {
            // Update user in localStorage directly
            localStorage.setItem('authUser', JSON.stringify({
                ...user,
                name: formData.name,
                email: formData.email
            }));
            setIsEditing(false);
        }
        catch (err) {
            setError('Failed to update profile');
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || ''
        });
        setError('');
        setIsEditing(false);
    };
    if (!user) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-semibold text-gray-700 mb-4", children: "Please login to view your profile" }), _jsx("button", { onClick: () => navigate('/login'), className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Go to Login" })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsxs("div", { className: "bg-white shadow rounded-lg", children: [_jsxs("div", { className: "px-4 py-6 sm:px-6 border-b border-gray-200", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Profile Settings" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Manage your personal information" })] }), _jsxs("div", { className: "px-4 py-6 sm:px-6", children: [error && (_jsx("div", { className: "mb-4 p-3 bg-red-50 border border-red-200 rounded-lg", children: _jsx("p", { className: "text-sm text-red-700", children: error }) })), _jsx("form", { onSubmit: handleSave, children: _jsx("div", { className: "space-y-6", children: !isEditing ? (_jsxs("div", { className: "bg-gray-50 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-2xl font-bold text-white", children: user.name.charAt(0).toUpperCase() }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: user.name }), _jsx("p", { className: "text-sm text-gray-500", children: user.email }), _jsx("p", { className: "mt-1 text-sm text-blue-600", children: user.role })] })] }), _jsx("button", { type: "button", onClick: () => setIsEditing(true), className: "text-blue-600 hover:text-blue-800 font-medium text-sm", children: "Edit Profile" })] })) : (
                                        /* Edit Form */
                                        _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700", children: "Full Name" }), _jsx("input", { type: "text", id: "name", name: "name", value: formData.name, onChange: handleChange, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2", required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email Address" }), _jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleChange, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2", required: true })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { type: "submit", disabled: isSaving, className: "flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed", children: isSaving ? 'Saving...' : 'Save Changes' }), _jsx("button", { type: "button", onClick: handleCancel, className: "flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed", children: "Cancel" })] })] })) }) })] })] }), _jsx("div", { className: "mt-6 flex gap-3", children: _jsx("button", { onClick: () => navigate('/dashboard'), className: "text-gray-600 hover:text-gray-800 text-sm font-medium", children: "\u2190 Back to Dashboard" }) })] }) }));
};
//# sourceMappingURL=ProfilePage.js.map