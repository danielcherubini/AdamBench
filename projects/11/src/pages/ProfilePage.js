import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = React.useState(false);
    const [formData, setFormData] = React.useState({ name: '', email: '' });
    React.useEffect(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email });
        }
    }, [user]);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSave = () => {
        if (user) {
            updateUser({ ...user, ...formData });
            setIsEditing(false);
        }
    };
    const handleCancel = () => {
        if (user) {
            setFormData({ name: user.name, email: user.email });
            setIsEditing(false);
        }
    };
    if (!user) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsx("div", { className: "text-center", children: _jsx("h2", { className: "text-xl font-semibold text-gray-700", children: "No user logged in" }) }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "max-w-3xl mx-auto", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-xl overflow-hidden", children: [_jsxs("div", { className: "bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-10 text-center", children: [_jsx("div", { className: "mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 mb-4", children: user.name.charAt(0).toUpperCase() }), _jsx("h1", { className: "text-3xl font-bold text-white mb-2", children: user.name }), _jsx("p", { className: "text-blue-100", children: user.email })] }), _jsxs("div", { className: "px-6 py-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Profile Information" }), _jsx("button", { onClick: () => setIsEditing(!isEditing), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: isEditing ? 'Cancel' : 'Edit Profile' })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Name" }), isEditing ? (_jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleChange, className: "w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" })) : (_jsx("p", { className: "text-lg text-gray-900", children: user.name }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), isEditing ? (_jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, className: "w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" })) : (_jsx("p", { className: "text-lg text-gray-900", children: user.email }))] }), isEditing && (_jsxs("div", { className: "flex gap-4 pt-4", children: [_jsx("button", { onClick: handleSave, className: "flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors", children: "Save Changes" }), _jsx("button", { onClick: handleCancel, className: "flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors", children: "Cancel" })] }))] })] })] }) }) }));
};
export default ProfilePage;
//# sourceMappingURL=ProfilePage.js.map