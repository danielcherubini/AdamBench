import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';
export function Layout({ children }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard';
    const isProfile = location.pathname === '/profile';
    return (_jsxs("div", { className: "layout", children: [user && (_jsx("header", { className: "header", children: _jsxs("div", { className: "header-content", children: [_jsx("h1", { className: "logo", children: "Auth App" }), _jsxs("nav", { className: "nav", children: [_jsx(Link, { to: "/dashboard", className: isDashboard ? 'nav-link active' : 'nav-link', children: "Dashboard" }), _jsx(Link, { to: "/profile", className: isProfile ? 'nav-link active' : 'nav-link', children: "Profile" }), _jsx("button", { onClick: logout, className: "logout-btn", children: "Logout" })] })] }) })), _jsx("main", { className: "main-content", children: children })] }));
}
//# sourceMappingURL=Layout.js.map