import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Main Layout Component
 * Provides the main layout structure for the application
 */
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthWithNavigate } from '../context/useAuthWithNavigate';
export const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logoutWithRedirect } = useAuthWithNavigate();
    const handleLogout = () => {
        logoutWithRedirect();
    };
    const isActive = (path) => location.pathname === path;
    return (_jsxs("div", { style: styles.container, children: [_jsxs("nav", { style: styles.navbar, children: [_jsx("div", { style: styles.navLogo, children: _jsx(Link, { to: "/", style: styles.logoLink, children: "OmniCoder" }) }), _jsxs("div", { style: styles.navLinks, children: [user && (_jsxs(_Fragment, { children: [user.role !== 'admin' && (_jsx(Link, { to: "/dashboard", style: styles.navLink(isActive('/dashboard')), children: "Dashboard" })), user.role === 'admin' && (_jsx(Link, { to: "/admin", style: styles.navLink(isActive('/admin')), children: "Admin Dashboard" })), _jsx(Link, { to: "/profile", style: styles.navLink(isActive('/profile')), children: "Profile" }), _jsx("button", { style: styles.logoutButton, onClick: handleLogout, children: "Logout" })] })), !user && (_jsx(Link, { to: "/login", style: styles.loginButton, children: "Login" }))] })] }), _jsx("main", { style: styles.main, children: _jsx(Outlet, {}) })] }));
};
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    navLogo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#333',
    },
    logoLink: {
        textDecoration: 'none',
        color: '#007bff',
    },
    navLinks: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
    },
    navLink: (active) => ({
        padding: '0.5rem 1rem',
        textDecoration: 'none',
        color: active ? '#007bff' : '#333',
        fontWeight: active ? '600' : '400',
        borderRadius: '4px',
        transition: 'all 0.2s',
    }),
    logoutButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.875rem',
    },
    loginButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.875rem',
    },
    main: {
        flex: 1,
        padding: '2rem',
    },
};
export default MainLayout;
//# sourceMappingURL=MainLayout.js.map