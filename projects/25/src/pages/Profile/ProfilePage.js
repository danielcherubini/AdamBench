import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context';
import styles from './Profile.module.css';
export const ProfilePage = () => {
    const { user, logout, updateProfile } = useAuthContext();
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };
    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);
        const success = await updateProfile({ name, email });
        setIsSaving(false);
        if (success) {
            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        }
        else {
            setMessage({ type: 'error', text: 'Invalid email format' });
        }
    };
    const handleCancel = () => {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setIsEditing(false);
        setMessage(null);
    };
    return (_jsxs("div", { className: styles.container, children: [_jsxs("nav", { className: styles.navbar, children: [_jsx("div", { className: styles.logo, children: "Profile" }), _jsxs("div", { className: styles.navLinks, children: [_jsx("button", { onClick: () => navigate('/dashboard'), className: styles.navLink, children: "Dashboard" }), _jsx("button", { onClick: handleLogout, className: styles.logoutBtn, children: "Logout" })] })] }), _jsx("main", { className: styles.main, children: _jsxs("div", { className: styles.card, children: [_jsxs("div", { className: styles.header, children: [_jsx("h1", { children: "User Profile" }), !isEditing && (_jsx("button", { onClick: () => setIsEditing(true), className: styles.editBtn, children: "Edit Profile" }))] }), message && (_jsx("div", { className: `${styles.message} ${styles[message.type]}`, children: message.text })), _jsxs("form", { onSubmit: handleSave, className: styles.form, children: [_jsxs("div", { className: styles.avatar, children: [_jsx("div", { className: styles.avatarCircle, children: name.charAt(0).toUpperCase() }), _jsx("span", { className: styles.avatarHint, children: "Profile Photo" })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { htmlFor: "name", children: "Full Name" }), _jsx("input", { id: "name", type: "text", value: name, onChange: (e) => setName(e.target.value), disabled: !isEditing, required: true })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { htmlFor: "email", children: "Email Address" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), disabled: !isEditing, required: true })] }), _jsxs("div", { className: styles.field, children: [_jsx("label", { htmlFor: "id", children: "User ID" }), _jsx("input", { id: "id", type: "text", value: user?.id || '', disabled: true, className: styles.readOnly }), _jsx("span", { className: styles.hint, children: "ID cannot be changed" })] }), isEditing && (_jsxs("div", { className: styles.actions, children: [_jsx("button", { type: "button", onClick: handleCancel, className: styles.cancelBtn, disabled: isSaving, children: "Cancel" }), _jsx("button", { type: "submit", className: styles.saveBtn, disabled: isSaving, children: isSaving ? 'Saving...' : 'Save Changes' })] }))] })] }) })] }));
};
//# sourceMappingURL=ProfilePage.js.map