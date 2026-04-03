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
const AuthContext_1 = require("../context/AuthContext");
const Profile = () => {
    const { user, logout } = (0, AuthContext_1.useAuth)();
    const [name, setName] = (0, react_1.useState)(user?.name || '');
    const [email, setEmail] = (0, react_1.useState)(user?.email || '');
    const [isSaving, setIsSaving] = (0, react_1.useState)(false);
    const [message, setMessage] = (0, react_1.useState)(null);
    const handleSave = (e) => {
        e.preventDefault();
        if (!user)
            return;
        setIsSaving(true);
        // Simulate saving to backend
        setTimeout(() => {
            // In a real app, you would update the user via an API and then update the context.
            // For this demo, we'll just show a success message.
            setMessage('Profile saved successfully!');
            setIsSaving(false);
            // Note: To actually update the context, you would need to add an updateUser method to the auth service.
        }, 1000);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "profile-container", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Profile" }), message && (0, jsx_runtime_1.jsx)("p", { className: "success", children: message }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSave, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "name", children: "Name:" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "name", value: name, onChange: (e) => setName(e.target.value), required: true, disabled: isSaving })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email", children: "Email:" }), (0, jsx_runtime_1.jsx)("input", { type: "email", id: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, disabled: isSaving })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: isSaving, children: isSaving ? 'Saving...' : 'Save Profile' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "profile-actions", children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "User ID:" }), " ", user?.id] }), (0, jsx_runtime_1.jsx)("button", { onClick: logout, children: "Logout" })] })] }));
};
exports.default = Profile;
//# sourceMappingURL=Profile.js.map