import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const Dashboard = () => {
    const { user, logout } = useAuth();
    if (!user)
        return null;
    const stats = [
        { icon: '👤', label: 'Name', value: user.name },
        { icon: '📧', label: 'Email', value: user.email },
        { icon: '🆔', label: 'User ID', value: user.id },
        { icon: '🔐', label: 'Status', value: 'Authenticated' },
    ];
    return (_jsxs("div", { className: "dashboard-container", children: [_jsxs("nav", { className: "navbar", children: [_jsx("div", { className: "navbar-brand", children: _jsx("h1", { children: "Dashboard" }) }), _jsxs("div", { className: "navbar-right", children: [_jsx(Link, { to: "/profile", className: "profile-link", children: "Profile" }), _jsxs("span", { className: "user-greeting", children: ["Hello, ", user.name, "!"] }), _jsx("button", { onClick: logout, className: "logout-btn", children: "Logout" })] })] }), _jsxs("main", { className: "dashboard-content", children: [_jsxs("div", { className: "welcome-card", children: [_jsx("h2", { children: "Welcome to Your Dashboard" }), _jsx("p", { children: "You have successfully logged in to a protected route." })] }), _jsx("div", { className: "stats-grid", children: stats.map((stat) => (_jsxs("div", { className: "stat-card", children: [_jsx("div", { className: "stat-icon", children: stat.icon }), _jsxs("div", { className: "stat-info", children: [_jsx("h3", { children: stat.label }), _jsx("p", { children: stat.value })] })] }, stat.label))) }), _jsxs("div", { className: "info-card", children: [_jsx("h3", { children: "Protected Route" }), _jsx("p", { children: "This page is protected by authentication. Only logged-in users can access this content." })] })] })] }));
};
export default Dashboard;
//# sourceMappingURL=Dashboard.js.map