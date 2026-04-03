"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const authService_1 = require("../services/authService");
require("../styles/ProfilePage.css");
const ProfilePage = () => {
    const { state, actions } = (0, authService_1.useAuth)();
    const { updateUser } = actions;
    const [profile, setProfile] = (0, react_1.useState)(null);
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const [editedProfile, setEditedProfile] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const [success, setSuccess] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (state.user) {
            setProfile({
                id: state.user.id,
                name: state.user.name,
                email: state.user.email
            });
            setEditedProfile({
                id: state.user.id,
                name: state.user.name,
                email: state.user.email
            });
        }
    }, [state.user]);
    const handleEdit = () => {
        if (profile) {
            setEditedProfile({ ...profile });
            setIsEditing(true);
            setError(null);
            setSuccess(null);
        }
    };
    const handleCancel = () => {
        if (profile) {
            setEditedProfile({ ...profile });
        }
        setIsEditing(false);
        setError(null);
        setSuccess(null);
    };
    const handleSave = async () => {
        if (!editedProfile || !profile)
            return;
        try {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(editedProfile.email)) {
                throw new Error('Please enter a valid email address');
            }
            // Update the user profile
            await updateUser(editedProfile);
            // Update local state
            setProfile({ ...editedProfile });
            setIsEditing(false);
            setSuccess('Profile updated successfully!');
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editedProfile) {
            setEditedProfile({
                ...editedProfile,
                [name]: value
            });
        }
    };
    if (!state.user) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "profile-page", children: (0, jsx_runtime_1.jsx)("div", { className: "profile-content", children: (0, jsx_runtime_1.jsx)("p", { children: "You must be logged in to view your profile." }) }) }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "profile-page", children: (0, jsx_runtime_1.jsxs)("div", { className: "profile-content", children: [(0, jsx_runtime_1.jsx)("h2", { children: "User Profile" }), error && (0, jsx_runtime_1.jsx)("div", { className: "error-message", children: error }), success && (0, jsx_runtime_1.jsx)("div", { className: "success-message", children: success }), isEditing && editedProfile ? ((0, jsx_runtime_1.jsxs)("div", { className: "profile-form", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "name", children: "Name:" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "name", name: "name", value: editedProfile.name, onChange: handleInputChange, className: "form-input" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email", children: "Email:" }), (0, jsx_runtime_1.jsx)("input", { type: "email", id: "email", name: "email", value: editedProfile.email, onChange: handleInputChange, className: "form-input" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-actions", children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleSave, className: "save-button", children: "Save Changes" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleCancel, className: "cancel-button", children: "Cancel" })] })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "profile-info", children: [(0, jsx_runtime_1.jsxs)("div", { className: "profile-field", children: [(0, jsx_runtime_1.jsx)("label", { children: "ID:" }), (0, jsx_runtime_1.jsx)("span", { children: profile?.id })] }), (0, jsx_runtime_1.jsxs)("div", { className: "profile-field", children: [(0, jsx_runtime_1.jsx)("label", { children: "Name:" }), (0, jsx_runtime_1.jsx)("span", { children: profile?.name })] }), (0, jsx_runtime_1.jsxs)("div", { className: "profile-field", children: [(0, jsx_runtime_1.jsx)("label", { children: "Email:" }), (0, jsx_runtime_1.jsx)("span", { children: profile?.email })] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleEdit, className: "edit-button", children: "Edit Profile" })] }))] }) }));
};
exports.default = ProfilePage;
//# sourceMappingURL=ProfilePage.js.map