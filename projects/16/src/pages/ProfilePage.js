import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../Layout';
import { useAuth } from '../auth';
export const ProfilePage = () => {
    const { user, updateProfile } = useAuth();
    const initialValues = useMemo(() => ({
        name: user?.name ?? '',
        email: user?.email ?? '',
    }), [user?.name, user?.email]);
    const [name, setName] = useState(initialValues.name);
    const [email, setEmail] = useState(initialValues.email);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const handleSubmit = (event) => {
        event.preventDefault();
        setMessage(null);
        setError(null);
        try {
            updateProfile({ name, email });
            setMessage('Profile updated successfully.');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
        }
    };
    return (_jsxs(Layout, { children: [_jsx("h1", { children: "Profile" }), _jsx("p", { className: "muted", children: "Edit your account details." }), _jsxs("form", { onSubmit: handleSubmit, className: "form-stack", children: [_jsxs("label", { children: ["Name", _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "Your name", autoComplete: "name", required: true })] }), _jsxs("label", { children: ["Email", _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@example.com", autoComplete: "email", required: true })] }), error && _jsx("p", { className: "error", children: error }), message && _jsx("p", { className: "success", children: message }), _jsx("button", { type: "submit", children: "Save changes" })] }), _jsxs("p", { className: "muted small", children: ["Back to ", _jsx(Link, { to: "/dashboard", children: "dashboard" })] })] }));
};
//# sourceMappingURL=ProfilePage.js.map