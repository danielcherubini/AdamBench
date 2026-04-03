import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
export function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    return (_jsxs("div", { className: "layout", children: [_jsx("header", { className: "header", children: _jsxs("div", { className: "header-content", children: [_jsx("h1", { className: "logo", children: "MyApp" }), _jsxs("nav", { className: "nav-links", children: [_jsx(NavLink, { to: "/dashboard", className: ({ isActive }) => isActive ? 'nav-link active' : 'nav-link', children: "Dashboard" }), _jsx(NavLink, { to: "/profile", className: ({ isActive }) => isActive ? 'nav-link active' : 'nav-link', children: "Profile" })] }), _jsxs("div", { className: "user-menu", children: [_jsxs("span", { className: "user-name", children: ["Welcome, ", user?.name] }), _jsx("button", { onClick: handleLogout, className: "logout-button", children: "Logout" })] })] }) }), _jsx("main", { className: "main-content", children: _jsx(Outlet, {}) })] }));
}
//# sourceMappingURL=Layout.js.map