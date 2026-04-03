import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './auth';
export function Profile() {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const ok = await updateProfile(name, email);
        if (ok)
            setSuccess(true);
        setLoading(false);
    };
    return (_jsxs("div", { className: "profile-container", children: [_jsxs("header", { className: "profile-header", children: [_jsx(Link, { to: "/dashboard", className: "back-link", children: "\u2190 Dashboard" }), _jsx("h1", { children: "Profile Settings" })] }), _jsxs("main", { className: "profile-content", children: [_jsxs("div", { className: "profile-card", children: [_jsx("div", { className: "profile-avatar", children: _jsx("div", { className: "avatar-circle", children: user?.name?.[0] || 'U' }) }), _jsxs("form", { onSubmit: handleSubmit, className: "profile-form", children: [success && _jsx("div", { className: "success-message", children: "Profile updated!" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "name", children: "Name" }), _jsx("input", { id: "name", value: name, onChange: (e) => setName(e.target.value), required: true, disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, disabled: loading })] }), _jsxs("div", { className: "form-actions", children: [_jsx(Link, { to: "/dashboard", className: "cancel-button", children: "Cancel" }), _jsx("button", { type: "submit", className: "save-button", disabled: loading, children: loading ? 'Saving...' : 'Save' })] })] })] }), _jsxs("div", { className: "profile-info-card", children: [_jsx("h3", { children: "Account Info" }), _jsxs("div", { className: "info-row", children: [_jsx("span", { children: "Member since" }), _jsx("span", { children: "Jan 2024" })] }), _jsxs("div", { className: "info-row", children: [_jsx("span", { children: "Account type" }), _jsx("span", { children: "Premium" })] }), _jsxs("div", { className: "info-row", children: [_jsx("span", { children: "Status" }), _jsx("span", { className: "status-active", children: "Active" })] })] })] })] }));
}
//# sourceMappingURL=Profile.js.map