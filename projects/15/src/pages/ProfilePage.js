import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error)
            setError(null);
    };
    const handleSave = async (e) => {
        e.preventDefault();
        setError(null);
        if (!formData.name || !formData.email) {
            setError('Please fill in all fields');
            return;
        }
        if (formData.name.length < 2) {
            setError('Name must be at least 2 characters');
            return;
        }
        setIsSaving(true);
        try {
            // Update user in storage
            const updatedUser = {
                ...user,
                name: formData.name,
                email: formData.email,
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setFormData({
                name: updatedUser.name,
                email: updatedUser.email,
            });
            setIsEditing(false);
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    return (_jsx("div", { className: "profile-page", children: _jsx("div", { className: "profile-container", children: _jsxs("div", { className: "profile-card", children: [_jsxs("div", { className: "profile-header", children: [_jsx("h1", { children: "Profile Settings" }), _jsx("button", { onClick: handleLogout, className: "logout-btn", children: "Logout" })] }), _jsxs("form", { onSubmit: handleSave, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "name", children: "Name" }), _jsx("input", { id: "name", name: "name", type: "text", value: formData.name, onChange: handleInputChange, placeholder: "Enter your name", required: true, disabled: isSaving })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", name: "email", type: "email", value: formData.email, onChange: handleInputChange, placeholder: "your.email@example.com", required: true, disabled: isSaving })] }), error && _jsx("div", { className: "error-message", children: error }), _jsx("div", { className: "button-group", children: isEditing ? (_jsxs(_Fragment, { children: [_jsx("button", { type: "submit", className: "submit-btn", disabled: isSaving, children: isSaving ? 'Saving...' : 'Save Changes' }), _jsx("button", { type: "button", onClick: () => {
                                                setIsEditing(false);
                                                setFormData({ name: user?.name || '', email: user?.email || '' });
                                                setError(null);
                                            }, className: "cancel-btn", children: "Cancel" })] })) : (_jsx("button", { type: "button", onClick: () => setIsEditing(true), className: "edit-btn", children: "Edit Profile" })) })] }), _jsxs("div", { className: "profile-info", children: [_jsx("h3", { children: "Account Information" }), _jsxs("dl", { children: [_jsxs("div", { className: "info-row", children: [_jsx("dt", { children: "ID" }), _jsx("dd", { children: "12345" })] }), _jsxs("div", { className: "info-row", children: [_jsx("dt", { children: "Role" }), _jsx("dd", { children: "User" })] }), _jsxs("div", { className: "info-row", children: [_jsx("dt", { children: "Member Since" }), _jsx("dd", { children: new Date().toLocaleDateString() })] })] })] })] }) }) }));
};
//# sourceMappingURL=ProfilePage.js.map