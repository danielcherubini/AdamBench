import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
const ProfilePage = () => {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState(user?.name ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const handleChange = (e) => {
        const input = e.target;
        if (input.name === 'name') {
            setName(input.value);
        }
        else if (input.name === 'email') {
            setEmail(input.value);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile({ name: name.trim(), email: email.trim() });
    };
    return (_jsxs("div", { style: { padding: '2rem' }, children: [_jsx("h2", { children: "Profile" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("div", { children: _jsxs("label", { children: ["Name:", _jsx("input", { type: "text", name: "name", value: name, onChange: handleChange, required: true })] }) }), _jsx("div", { children: _jsxs("label", { children: ["Email:", _jsx("input", { type: "email", name: "email", value: email, onChange: handleChange, required: true })] }) }), _jsx("button", { type: "submit", children: "Save" })] }), _jsx("button", { onClick: () => {
                    // optionally navigate back to dashboard
                }, children: "Back" })] }));
};
export default ProfilePage;
//# sourceMappingURL=Profile.js.map