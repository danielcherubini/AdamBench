import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * User Profile Page
 * Allows users to view and edit their profile information
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User } from '../types/auth';
export const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        // Load user data when mounted
        const currentUser = useAuth().getCurrentUser();
        if (currentUser) {
            setFormData({
                name: currentUser.name || '',
                email: currentUser.email || '',
            });
        }
        setIsLoaded(true);
    }, []);
    if (!user || !isLoaded) {
        return (_jsx("div", { style: styles.container, children: _jsx("div", { style: styles.loading, children: "Loading..." }) }));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Note: In a real app, you would call an API here
            // For now, we'll just update the local state
            console.log('Profile updated:', formData);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setIsEditing(false);
            // In a real app, you would update the auth state here
        }
        catch (error) {
            console.error('Failed to update profile:', error);
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (_jsxs("div", { style: styles.container, children: [_jsx("h1", { style: styles.title, children: "Profile" }), _jsxs("div", { style: styles.card, children: [_jsxs("div", { style: styles.header, children: [_jsx("h2", { style: styles.cardTitle, children: isEditing ? 'Edit Profile' : 'Profile Information' }), isEditing && (_jsxs("div", { style: styles.buttonGroup, children: [_jsx("button", { style: styles.saveButton, onClick: handleSubmit, disabled: isSaving, children: isSaving ? 'Saving...' : 'Save Changes' }), _jsx("button", { style: styles.cancelButton, onClick: () => setIsEditing(false), disabled: isSaving, children: "Cancel" })] })), !isEditing && (_jsx("button", { style: styles.editButton, onClick: () => setIsEditing(true), children: "Edit" }))] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { style: styles.formGroup, children: [_jsx("label", { style: styles.label, children: "Name" }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleInputChange, disabled: !isEditing, style: {
                                            ...styles.input,
                                            ...(isEditing ? { backgroundColor: 'white' } : { backgroundColor: '#f5f5f5' }),
                                        } })] }), _jsxs("div", { style: styles.formGroup, children: [_jsx("label", { style: styles.label, children: "Email" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleInputChange, disabled: !isEditing, style: {
                                            ...styles.input,
                                            ...(isEditing ? { backgroundColor: 'white' } : { backgroundColor: '#f5f5f5' }),
                                        } })] }), _jsxs("div", { style: styles.buttonGroup, children: [_jsx("button", { type: "submit", style: styles.submitButton, disabled: !isEditing || isSaving, children: isSaving ? 'Saving...' : 'Save Changes' }), _jsx("button", { type: "button", style: styles.logoutButton, onClick: handleLogout, children: "Logout" })] })] })] }), _jsxs("div", { style: styles.info, children: [_jsx("h3", { children: "Account Information" }), _jsxs("p", { children: [_jsx("strong", { children: "ID:" }), " ", user.id] }), _jsxs("p", { children: [_jsx("strong", { children: "Email:" }), " ", user.email] }), _jsxs("p", { children: [_jsx("strong", { children: "Role:" }), " ", user.role] })] })] }));
};
const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    title: {
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
    },
    cardTitle: {
        margin: 0,
        fontSize: '1.5rem',
        color: '#333',
    },
    buttonGroup: {
        display: 'flex',
        gap: '0.5rem',
    },
    editButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.875rem',
    },
    saveButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.875rem',
    },
    cancelButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.875rem',
    },
    submitButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.875rem',
    },
    logoutButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.875rem',
    },
    formGroup: {
        marginBottom: '1.5rem',
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1rem',
        boxSizing: 'border-box',
    },
    loading: {
        textAlign: 'center',
        padding: '2rem',
        color: '#666',
    },
    info: {
        marginTop: '2rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '1.5rem',
    },
};
export default ProfilePage;
//# sourceMappingURL=ProfilePage.js.map