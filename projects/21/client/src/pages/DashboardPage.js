import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Dashboard Page Component
 * Main user dashboard
 */
import { useAuth } from '../context/AuthContext';
export const DashboardPage = () => {
    const { user, isAuthenticated } = useAuth();
    const stats = [
        { label: 'User ID', value: user?.id || 'N/A', icon: '👤' },
        { label: 'Email', value: user?.email || 'N/A', icon: '📧' },
        { label: 'Authentication Status', value: isAuthenticated ? 'Authenticated' : 'Not Authenticated', icon: '🔒', color: isAuthenticated ? 'success' : 'warning' },
    ];
    return (_jsx("div", { className: "dashboard-page", children: _jsxs("div", { className: "dashboard-container", children: [_jsxs("header", { className: "dashboard-header", children: [_jsx("h1", { children: "Dashboard" }), _jsxs("div", { className: "user-info", children: [_jsx("span", { className: "user-name", children: user?.name }), _jsx("span", { className: "user-role", children: user?.role })] })] }), _jsxs("div", { className: "dashboard-content", children: [_jsxs("div", { className: "welcome-card", children: [_jsxs("h2", { children: ["Welcome, ", user?.name || 'User', "!"] }), _jsx("p", { children: "Welcome to your dashboard. This is where you can see your account information and manage your settings." })] }), _jsx("div", { className: "stats-grid", children: stats.map((stat) => (_jsxs("div", { className: "stat-card", children: [_jsx("div", { className: `stat-icon ${stat.color ? `stat-icon-${stat.color}` : ''}`, children: stat.icon }), _jsxs("div", { className: "stat-info", children: [_jsx("span", { className: "stat-label", children: stat.label }), _jsx("span", { className: `stat-value ${stat.color ? `stat-value-${stat.color}` : ''}`, children: stat.value })] })] }, stat.label))) }), _jsxs("div", { className: "role-section", children: [_jsx("h3", { children: "Your Role" }), _jsx("p", { className: "role-badge", children: user?.role || 'Unknown' }), _jsx("p", { children: user?.role === 'admin'
                                        ? 'You have full administrative access to the system.'
                                        : 'You have standard user access to the system.' })] })] })] }) }));
};
//# sourceMappingURL=DashboardPage.js.map