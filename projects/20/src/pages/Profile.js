import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isValidEmail } from '../utils';
const Profile = () => {
    const { user, updateUser, logout, loading } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [updateError, setUpdateError] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setUpdateError('');
        setUpdateSuccess('');
        // Reset to current user data when canceling edit
        if (isEditing && user) {
            setName(user.name);
            setEmail(user.email);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateError('');
        setUpdateSuccess('');
        if (!user) {
            setUpdateError('No user found');
            return;
        }
        // Basic validation
        if (!name.trim()) {
            setUpdateError('Name is required');
            return;
        }
        if (!email.trim()) {
            setUpdateError('Email is required');
            return;
        }
        // Email format validation
        if (!isValidEmail(email)) {
            setUpdateError('Please enter a valid email address');
            return;
        }
        setIsUpdating(true);
        const result = await updateUser(user.id, { name, email });
        setIsUpdating(false);
        if (result.success) {
            setUpdateSuccess('Profile updated successfully!');
            setIsEditing(false);
        }
        else {
            setUpdateError(result.error || 'Failed to update profile');
        }
    };
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    if (!user) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "No user found" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Please login to view your profile." }), _jsx(Link, { to: "/login", className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: "Go to Login" })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-100 py-6", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "bg-white shadow overflow-hidden sm:rounded-lg", children: [_jsxs("div", { className: "px-4 py-5 sm:px-6 flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Profile" }), _jsx("p", { className: "mt-1 max-w-2xl text-sm text-gray-500", children: "Manage your account information" })] }), _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { onClick: handleEditToggle, className: "inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", disabled: isUpdating || loading, children: isEditing ? 'Cancel' : 'Edit Profile' }), _jsx("button", { onClick: handleLogout, disabled: loading, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? 'Logging out...' : 'Logout' })] })] }), _jsxs("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-0", children: [updateSuccess && (_jsx("div", { className: "mb-4 mx-6 mt-6 p-3 bg-green-50 border border-green-200 rounded-md", children: _jsx("p", { className: "text-sm text-green-700", children: updateSuccess }) })), updateError && (_jsx("div", { className: "mb-4 mx-6 mt-6 p-3 bg-red-50 border border-red-200 rounded-md", children: _jsx("p", { className: "text-sm text-red-700", children: updateError }) })), isEditing ? (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 px-4 py-5 sm:p-6", children: [_jsxs("div", { className: "grid grid-cols-1 gap-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700", children: "Full Name" }), _jsx("input", { type: "text", id: "name", value: name, onChange: (e) => setName(e.target.value), className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm", placeholder: "Enter your name", disabled: isUpdating })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email Address" }), _jsx("input", { type: "email", id: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm", placeholder: "Enter your email", disabled: isUpdating }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "This will be used for login and notifications" })] })] }), _jsxs("div", { className: "flex justify-end space-x-3", children: [_jsx("button", { type: "button", onClick: handleEditToggle, className: "px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", disabled: isUpdating, children: "Cancel" }), _jsx("button", { type: "submit", disabled: isUpdating, className: "px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed", children: isUpdating ? 'Saving...' : 'Save Changes' })] })] })) : (_jsxs("dl", { className: "sm:divide-y sm:divide-gray-200", children: [_jsxs("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [_jsx("dt", { className: "text-sm font-medium text-gray-500", children: "Full name" }), _jsx("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2", children: user.name })] }), _jsxs("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [_jsx("dt", { className: "text-sm font-medium text-gray-500", children: "Email address" }), _jsx("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2", children: user.email })] }), _jsxs("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [_jsx("dt", { className: "text-sm font-medium text-gray-500", children: "User ID" }), _jsx("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2", children: user.id })] }), _jsxs("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [_jsx("dt", { className: "text-sm font-medium text-gray-500", children: "Account type" }), _jsx("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2", children: _jsx("span", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800", children: "Standard User" }) })] }), _jsxs("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [_jsx("dt", { className: "text-sm font-medium text-gray-500", children: "Member since" }), _jsx("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2", children: "March 2024" })] })] }))] })] }), _jsxs("div", { className: "mt-8 grid grid-cols-1 gap-6", children: [_jsxs("div", { className: "bg-white shadow overflow-hidden sm:rounded-lg", children: [_jsxs("div", { className: "px-4 py-5 sm:px-6", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Account Security" }), _jsx("p", { className: "mt-1 max-w-2xl text-sm text-gray-500", children: "Manage your account security settings" })] }), _jsx("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-6", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-gray-900", children: "Change Password" }), _jsx("p", { className: "text-sm text-gray-500", children: "Update your password regularly for better security" })] }), _jsx("button", { type: "button", className: "inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: "Change Password" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-gray-900", children: "Two-Factor Authentication" }), _jsx("p", { className: "text-sm text-gray-500", children: "Add an extra layer of security to your account" })] }), _jsx("span", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800", children: "Not Enabled" })] })] }) })] }), _jsxs("div", { className: "bg-white shadow overflow-hidden sm:rounded-lg", children: [_jsxs("div", { className: "px-4 py-5 sm:px-6", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Navigation" }), _jsx("p", { className: "mt-1 max-w-2xl text-sm text-gray-500", children: "Quick links to other sections" })] }), _jsx("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-6", children: _jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [_jsxs(Link, { to: "/dashboard", className: "flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors", children: [_jsx("div", { className: "flex-shrink-0 h-10 w-10 rounded-md bg-blue-500 flex items-center justify-center", children: _jsx("svg", { className: "h-6 w-6 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900", children: "Dashboard" }), _jsx("p", { className: "text-sm text-gray-500", children: "View your dashboard" })] })] }), _jsxs(Link, { to: "/", className: "flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors", children: [_jsx("div", { className: "flex-shrink-0 h-10 w-10 rounded-md bg-green-500 flex items-center justify-center", children: _jsx("svg", { className: "h-6 w-6 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900", children: "Home" }), _jsx("p", { className: "text-sm text-gray-500", children: "Return to home page" })] })] })] }) })] })] })] }) }));
};
export default Profile;
//# sourceMappingURL=Profile.js.map