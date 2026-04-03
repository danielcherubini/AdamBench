import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
export function Navigation() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    return (_jsx("nav", { className: "site-navigation", children: _jsxs("ul", { className: "nav-list", children: [_jsx("li", { className: "nav-item", children: _jsx(Link, { to: "/dashboard", className: `nav-link ${isActive('/dashboard') ? 'active' : ''}`, children: "Dashboard" }) }), _jsx("li", { className: "nav-item", children: _jsx(Link, { to: "/snake", className: `nav-link ${isActive('/snake') ? 'active' : ''}`, children: "\uD83C\uDFAE Snake Game" }) }), _jsx("li", { className: "nav-item", children: _jsx(Link, { to: "/profile", className: `nav-link ${isActive('/profile') ? 'active' : ''}`, children: "Profile" }) })] }) }));
}
//# sourceMappingURL=Navigation.js.map