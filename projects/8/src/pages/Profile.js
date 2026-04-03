import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../context/AuthContext';
import './Profile.css';
export function Profile() {
    const { user } = useAuth();
    if (!user)
        return null;
    return (_jsxs("div", { className: "profile", children: [_jsxs("div", { className: "profile-header", children: [_jsx("div", { className: "profile-avatar", children: user.username[0].toUpperCase() }), _jsxs("div", { className: "profile-info", children: [_jsx("h2", { children: user.username }), _jsx("p", { children: user.email }), _jsx("span", { className: "role-badge", children: user.role })] })] }), _jsxs("div", { className: "profile-details", children: [_jsx("h3", { children: "Account Details" }), _jsxs("div", { className: "detail-row", children: [_jsx("span", { className: "detail-label", children: "User ID" }), _jsx("span", { className: "detail-value", children: user.id })] }), _jsxs("div", { className: "detail-row", children: [_jsx("span", { className: "detail-label", children: "Email" }), _jsx("span", { className: "detail-value", children: user.email })] }), _jsxs("div", { className: "detail-row", children: [_jsx("span", { className: "detail-label", children: "Role" }), _jsx("span", { className: "detail-value", children: user.role })] }), _jsxs("div", { className: "detail-row", children: [_jsx("span", { className: "detail-label", children: "Member Since" }), _jsx("span", { className: "detail-value", children: "Jan 2024" })] })] })] }));
}
//# sourceMappingURL=Profile.js.map