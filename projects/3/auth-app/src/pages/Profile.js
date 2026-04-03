import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const Profile = () => {
    const navigate = useNavigate();
    const { user, updateUser, isLoading, error } = useAuth();
    const [name, setName] = useState(user?.name ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser({ name, email });
        }
        catch {
            // Error handled by context
        }
    };
    if (!user)
        return null;
    return (_jsxs("div", { className: "profile-container", children: [_jsxs("div", { className: "profile-header", children: [_jsx("h1", { children: "User Profile" }), _jsx("p", { className: "subtitle", children: "Manage your account information" })] }), _jsxs("div", { className: "profile-card", children: [_jsxs("form", { onSubmit: handleSubmit, children: [error && _jsx("div", { className: "error-message", children: error.message }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "name", children: "Name" }), _jsx("input", { type: "text", id: "name", value: name, onChange: (e) => setName(e.target.value), disabled: isLoading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { type: "email", id: "email", value: email, onChange: (e) => setEmail(e.target.value), disabled: isLoading })] }), _jsxs("div", { className: "form-actions", children: [_jsx("button", { type: "button", onClick: () => navigate('/dashboard'), className: "cancel-btn", children: "Cancel" }), _jsx("button", { type: "submit", className: "submit-btn", disabled: isLoading, children: isLoading ? 'Saving...' : 'Save Changes' })] })] }), _jsxs("div", { className: "profile-info", children: [_jsx("h3", { children: "Account Information" }), _jsxs("div", { className: "info-row", children: [_jsx("span", { className: "info-label", children: "User ID:" }), _jsx("span", { className: "info-value", children: user.id })] }), _jsxs("div", { className: "info-row", children: [_jsx("span", { className: "info-label", children: "Current Email:" }), _jsx("span", { className: "info-value", children: user.email })] })] })] })] }));
};
export default Profile;
//# sourceMappingURL=Profile.js.map