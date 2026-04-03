import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
export function ProfilePage() {
    const { user, updateUser, logout, error, clearError } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    // Initialize form with current user data
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);
    // Clear messages when form changes
    useEffect(() => {
        if (error || successMessage) {
            clearError();
            setSuccessMessage('');
        }
    }, [name, email, error, successMessage, clearError]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage('');
        const updateError = await updateUser({ name, email });
        if (!updateError) {
            setSuccessMessage('Profile updated successfully!');
            setIsSubmitting(false);
        }
        else {
            setIsSubmitting(false);
        }
    };
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const handleCancel = () => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
        clearError();
        setSuccessMessage('');
    };
    if (!user) {
        return null;
    }
    return (_jsxs("div", { style: styles.container, children: [_jsxs("header", { style: styles.header, children: [_jsx("button", { onClick: () => navigate('/dashboard'), style: styles.backButton, children: "\u2190 Back to Dashboard" }), _jsxs("div", { style: styles.headerRight, children: [_jsx("span", { style: styles.userName, children: user.name }), _jsx("button", { onClick: handleLogout, style: styles.logoutButton, children: "Logout" })] })] }), _jsxs("main", { style: styles.main, children: [_jsxs("div", { style: styles.card, children: [_jsx("h1", { style: styles.title, children: "Profile Settings" }), _jsx("p", { style: styles.subtitle, children: "Update your personal information" }), _jsxs("form", { onSubmit: handleSubmit, style: styles.form, children: [_jsxs("div", { style: styles.formGroup, children: [_jsx("label", { htmlFor: "name", style: styles.label, children: "Full Name" }), _jsx("input", { id: "name", type: "text", value: name, onChange: (e) => setName(e.target.value), style: styles.input, placeholder: "Your name", required: true, disabled: isSubmitting })] }), _jsxs("div", { style: styles.formGroup, children: [_jsx("label", { htmlFor: "email", style: styles.label, children: "Email Address" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), style: styles.input, placeholder: "your@email.com", required: true, disabled: isSubmitting })] }), error && (_jsx("div", { style: styles.errorContainer, children: _jsx("p", { style: styles.error, children: error.message }) })), successMessage && (_jsx("div", { style: styles.successContainer, children: _jsx("p", { style: styles.success, children: successMessage }) })), _jsxs("div", { style: styles.buttonGroup, children: [_jsx("button", { type: "button", onClick: handleCancel, style: styles.cancelButton, disabled: isSubmitting, children: "Cancel" }), _jsx("button", { type: "submit", style: styles.submitButton, disabled: isSubmitting, children: isSubmitting ? 'Saving...' : 'Save Changes' })] })] })] }), _jsxs("div", { style: styles.infoCard, children: [_jsx("h2", { style: styles.infoTitle, children: "Account Information" }), _jsxs("div", { style: styles.infoItem, children: [_jsx("span", { style: styles.infoLabel, children: "User ID:" }), _jsx("span", { style: styles.infoValue, children: user.id })] }), _jsxs("div", { style: styles.infoItem, children: [_jsx("span", { style: styles.infoLabel, children: "Member Since:" }), _jsx("span", { style: styles.infoValue, children: "January 2024" })] }), _jsxs("div", { style: styles.infoItem, children: [_jsx("span", { style: styles.infoLabel, children: "Account Status:" }), _jsx("span", { style: styles.statusBadge, children: "Active" })] })] })] })] }));
}
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    backButton: {
        padding: '8px 16px',
        backgroundColor: 'transparent',
        color: '#3498db',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    userName: {
        color: '#333',
        fontSize: '14px',
    },
    logoutButton: {
        padding: '8px 16px',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    main: {
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    title: {
        margin: '0 0 8px 0',
        fontSize: '28px',
        color: '#333',
    },
    subtitle: {
        margin: '0 0 32px 0',
        color: '#666',
        fontSize: '16px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '14px',
        fontWeight: 600,
        color: '#333',
    },
    input: {
        padding: '12px 16px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    errorContainer: {
        padding: '12px',
        backgroundColor: '#fdf2f2',
        borderRadius: '4px',
        border: '1px solid #fecaca',
    },
    error: {
        color: '#dc2626',
        fontSize: '14px',
        margin: '0',
    },
    successContainer: {
        padding: '12px',
        backgroundColor: '#f0fdf4',
        borderRadius: '4px',
        border: '1px solid #bbf7d0',
    },
    success: {
        color: '#16a34a',
        fontSize: '14px',
        margin: '0',
    },
    buttonGroup: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
        marginTop: '8px',
    },
    cancelButton: {
        padding: '12px 24px',
        backgroundColor: '#f3f4f6',
        color: '#374151',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 500,
    },
    submitButton: {
        padding: '12px 24px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 500,
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    infoTitle: {
        margin: '0 0 20px 0',
        fontSize: '20px',
        color: '#333',
    },
    infoItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '1px solid #eee',
    },
    infoLabel: {
        color: '#666',
        fontSize: '14px',
    },
    infoValue: {
        color: '#333',
        fontSize: '14px',
        fontWeight: 500,
    },
    statusBadge: {
        padding: '4px 12px',
        backgroundColor: '#dcfce7',
        color: '#16a34a',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
    },
};
//# sourceMappingURL=ProfilePage.js.map