"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const AuthContext_1 = require("../context/AuthContext");
const Profile = () => {
    const { user, updateProfile } = (0, AuthContext_1.useAuth)();
    const [name, setName] = (0, react_1.useState)(user?.name ?? '');
    const [email, setEmail] = (0, react_1.useState)(user?.email ?? '');
    const [saving, setSaving] = (0, react_1.useState)(false);
    const [message, setMessage] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email ?? '');
        }
    }, [user]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await updateProfile(name, email);
            setMessage('Profile updated successfully');
        }
        catch (err) {
            setMessage('Error updating profile');
        }
        finally {
            setSaving(false);
        }
    };
    if (!user)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { style: { maxWidth: 400, margin: 'auto', padding: 20 }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Profile" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 10 }, children: [(0, jsx_runtime_1.jsx)("label", { children: "Username" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), required: true })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 10 }, children: [(0, jsx_runtime_1.jsx)("label", { children: "Email" }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: saving, style: { marginTop: 10 }, children: saving ? 'Saving...' : 'Save' }), message && (0, jsx_runtime_1.jsx)("p", { children: message })] })] }));
};
exports.default = Profile;
//# sourceMappingURL=Profile.js.map