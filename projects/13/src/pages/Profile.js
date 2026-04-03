import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Navigation } from '../components/Navigation';
/**
 * Profile Page
 *
 * Allows users to view and edit their profile information.
 * Changes are saved to localStorage and reflected in the auth state.
 */
export function Profile() {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState(null);
    // Load user data when user changes
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
            });
        }
    }, [user]);
    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    // Handle save
    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);
        try {
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 500));
            // Validate form data
            if (!formData.name || formData.name.trim().length < 2) {
                setSaveError('Name must be at least 2 characters');
                setIsSaving(false);
                return;
            }
            if (!formData.email || !formData.email.includes('@')) {
                setSaveError('Please enter a valid email address');
                setIsSaving(false);
                return;
            }
            // Save to localStorage
            const updatedUser = {
                ...user,
                name: formData.name.trim(),
                email: formData.email.trim(),
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            // Update auth state
            // Note: In a real app, you'd need to update the context provider
            // For now, we'll reload the user from localStorage
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                localStorage.setItem('user', JSON.stringify({ ...parsedUser, id: user.id }));
            }
            // Reload user from storage
            const newUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (newUser) {
                // This is a workaround to update the user state
                // In a real app, we'd need to update the context or use a different approach
                setFormData({ name: newUser.name, email: newUser.email });
            }
            setSaveSuccess(true);
            setIsEditing(false);
            // Clear success message after 3 seconds
            setTimeout(() => setSaveSuccess(false), 3000);
        }
        catch {
            setSaveError('Failed to save changes. Please try again.');
        }
        finally {
            setIsSaving(false);
        }
    };
    // Handle cancel
    const handleCancel = () => {
        setFormData({ name: user.name, email: user.email });
        setIsEditing(false);
    };
    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };
    return (_jsxs("div", { className: "container", children: [_jsx(Navigation, {}), _jsxs("div", { className: "card", children: [_jsx("div", { className: "card-header", children: _jsxs("h2", { children: ["My Profile", saveSuccess && _jsx("span", { className: "success-badge", children: "\u2713 Saved" })] }) }), _jsx("div", { className: "profile-avatar", children: _jsx("img", { src: user?.avatar, alt: `${user?.name}'s avatar`, className: "avatar-large" }) }), _jsxs("form", { onSubmit: handleSave, className: "profile-form", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "name", children: "Full Name" }), _jsx("input", { type: "text", id: "name", name: "name", value: formData.name, onChange: handleInputChange, disabled: !isEditing, placeholder: "Enter your full name", className: isEditing ? '' : 'read-only' })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Email Address" }), _jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleInputChange, disabled: !isEditing, placeholder: "Enter your email", className: isEditing ? '' : 'read-only' })] }), saveError && (_jsx("div", { className: "error-message", children: saveError })), _jsx("div", { className: "form-actions", children: isEditing ? (_jsxs(_Fragment, { children: [_jsx("button", { type: "submit", disabled: isSaving, className: "btn btn-primary", children: isSaving ? 'Saving...' : 'Save Changes' }), _jsx("button", { type: "button", onClick: handleCancel, className: "btn btn-secondary", children: "Cancel" })] })) : (_jsx("button", { type: "button", onClick: () => setIsEditing(true), className: "btn btn-primary", children: "Edit Profile" })) })] }), _jsxs("div", { className: "profile-info", children: [_jsx("h3", { children: "Account Information" }), _jsxs("div", { className: "info-row", children: [_jsx("span", { className: "info-label", children: "User ID:" }), _jsx("span", { className: "info-value", children: user?.id })] }), _jsxs("div", { className: "info-row", children: [_jsx("span", { className: "info-label", children: "Email:" }), _jsx("span", { className: "info-value", children: user?.email })] }), _jsxs("div", { className: "info-row", children: [_jsx("span", { className: "info-label", children: "Name:" }), _jsx("span", { className: "info-value", children: user?.name })] })] }), _jsx("div", { className: "card-actions", children: _jsx("button", { type: "button", onClick: handleLogout, className: "btn btn-danger", children: "Logout" }) })] })] }));
}
export default Profile;
//# sourceMappingURL=Profile.js.map