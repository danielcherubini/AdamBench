import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
export function Profile() {
    const { user, updateProfile, error, clearError } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name ?? '',
        email: user?.email ?? '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    // Sync form with user data
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
            });
        }
    }, [user]);
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage(null);
        clearError();
        if (!validateForm())
            return;
        setIsSubmitting(true);
        try {
            // Only send changed fields
            const updates = {};
            if (formData.name !== user?.name)
                updates.name = formData.name.trim();
            if (formData.email !== user?.email)
                updates.email = formData.email.trim();
            if (Object.keys(updates).length === 0) {
                setSuccessMessage('No changes to save');
                setIsSubmitting(false);
                return;
            }
            await updateProfile(updates);
            setSuccessMessage('Profile updated successfully!');
        }
        catch {
            // Error is handled by AuthContext
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleInputChange = (field) => (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear field error on change
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
        // Clear messages on change
        if (successMessage)
            setSuccessMessage(null);
        if (error)
            clearError();
    };
    const hasChanges = formData.name !== user?.name ||
        formData.email !== user?.email;
    return (_jsxs("div", { className: "profile-page", children: [_jsxs("div", { className: "profile-header", children: [_jsx("h2", { children: "Profile Settings" }), _jsx("p", { className: "subtitle", children: "Manage your account information" })] }), _jsxs("div", { className: "profile-card", children: [_jsxs("div", { className: "profile-avatar", children: [_jsx("div", { className: "avatar-circle", children: user?.name.charAt(0).toUpperCase() }), _jsxs("div", { className: "avatar-info", children: [_jsx("h3", { children: user?.name }), _jsx("p", { children: user?.email })] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "profile-form", noValidate: true, children: [error && (_jsx("div", { className: "error-message", role: "alert", children: error })), successMessage && (_jsx("div", { className: "success-message", role: "status", children: successMessage })), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "name", children: "Full Name" }), _jsx("input", { id: "name", name: "name", type: "text", value: formData.name, onChange: handleInputChange('name'), placeholder: "Enter your name", disabled: isSubmitting, className: errors.name ? 'input-error' : '' }), errors.name && (_jsx("span", { className: "field-error", children: errors.name }))] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Email Address" }), _jsx("input", { id: "email", name: "email", type: "email", value: formData.email, onChange: handleInputChange('email'), placeholder: "Enter your email", disabled: isSubmitting, className: errors.email ? 'input-error' : '' }), errors.email && (_jsx("span", { className: "field-error", children: errors.email }))] }), _jsx("div", { className: "form-actions", children: _jsx("button", { type: "submit", className: "save-button", disabled: isSubmitting || !hasChanges, children: isSubmitting ? 'Saving...' : 'Save Changes' }) }), hasChanges && !isSubmitting && (_jsx("p", { className: "unsaved-changes", children: "You have unsaved changes" }))] })] })] }));
}
//# sourceMappingURL=Profile.js.map