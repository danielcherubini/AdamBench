import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
export function AppLayout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    return (_jsxs("div", { className: "dashboard", children: [_jsxs("header", { className: "navbar", children: [_jsxs("div", { className: "navbar-brand", children: [_jsx("span", { className: "logo-icon", children: "\u26A1" }), _jsx("span", { children: "AppName" })] }), _jsxs("nav", { className: "navbar-nav", children: [_jsx(NavLink, { to: "/dashboard", className: ({ isActive }) => "nav-link" + (isActive ? " nav-link--active" : ""), children: "Dashboard" }), _jsx(NavLink, { to: "/profile", className: ({ isActive }) => "nav-link" + (isActive ? " nav-link--active" : ""), children: "Profile" })] }), _jsxs("div", { className: "navbar-user", children: [_jsx(NavLink, { to: "/profile", className: "avatar", "aria-label": "Go to profile", children: user?.avatarInitials }), _jsx("span", { className: "user-name", children: user?.name }), _jsx("button", { className: "btn-logout", onClick: () => { logout(); navigate("/login", { replace: true }); }, children: "Logout" })] })] }), _jsx("main", { className: "dashboard-main", children: children })] }));
}
//# sourceMappingURL=AppLayout.js.map