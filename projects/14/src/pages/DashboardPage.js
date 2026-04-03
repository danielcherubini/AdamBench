import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
const DEMO_STATS = {
    totalUsers: 1234,
    activeSessions: 56,
    revenue: 45230,
    growth: 12.5,
};
const DEMO_ACTIVITIES = [
    { type: 'dashboard_view', icon: '📊', text: 'New dashboard view', time: '2 minutes ago' },
    { type: 'email_received', icon: '📧', text: 'New email received', time: '1 hour ago' },
    { type: 'settings_changed', icon: '⚙️', text: 'Settings updated', time: '3 hours ago' },
];
const StatCard = ({ label, value }) => (_jsxs("div", { className: "stat-card", children: [_jsx("h3", { children: label }), _jsx("p", { className: "stat-value", children: value })] }));
const ActivityItem = ({ type, icon, text, time }) => {
    void type; // Mark as intentionally unused
    return (_jsxs("div", { className: "activity-item", children: [_jsx("span", { className: "activity-icon", children: icon }), _jsx("span", { className: "activity-text", children: text }), _jsx("span", { className: "activity-time", children: time })] }));
};
export const DashboardPage = () => {
    const { user, logout } = useAuth(null, 0);
    const handleLogout = () => {
        logout();
    };
    // Format stats
    const formattedStats = Object.entries(DEMO_STATS).map(([key, value]) => {
        const formattedValue = key === 'growth'
            ? `+${value}%`
            : key === 'revenue'
                ? `$${value.toLocaleString()}`
                : value.toLocaleString();
        return { key, value: formattedValue };
    });
    // Format activities
    const formattedActivities = DEMO_ACTIVITIES.map((activity) => ({
        ...activity,
        time: `${activity.time}`,
    }));
    return (_jsx("div", { className: "dashboard-page", children: _jsxs("div", { className: "dashboard-container", children: [_jsxs("header", { className: "dashboard-header", children: [_jsx("h1", { children: "Dashboard" }), _jsx("button", { onClick: handleLogout, className: "logout-btn", children: "Sign Out" })] }), _jsxs("main", { className: "dashboard-main", children: [_jsxs("section", { className: "welcome-section", children: [_jsxs("h2", { children: ["Welcome, ", user?.name, "!"] }), _jsxs("p", { children: ["Email: ", user?.email] })] }), _jsxs("section", { className: "stats-section", children: [_jsx(StatCard, { label: "Total Users", value: formattedStats[0].value }), _jsx(StatCard, { label: "Active Sessions", value: formattedStats[1].value }), _jsx(StatCard, { label: "Revenue", value: formattedStats[2].value }), _jsx(StatCard, { label: "Growth", value: formattedStats[3].value })] }), _jsxs("section", { className: "recent-activity-section", children: [_jsx("h2", { children: "Recent Activity" }), _jsx("div", { className: "activity-list", children: formattedActivities.map((activity, index) => (_jsx(ActivityItem, { ...activity }, index))) })] }), _jsxs("section", { className: "quick-actions-section", children: [_jsx("h2", { children: "Quick Actions" }), _jsxs("div", { className: "action-buttons", children: [_jsx(Link, { to: "/profile", className: "action-btn", children: "Profile Settings" }), _jsx(Link, { to: "/settings", className: "action-btn", children: "Account Settings" }), _jsx(Link, { to: "/reports", className: "action-btn", children: "View Reports" }), _jsx(Link, { to: "/analytics", className: "action-btn", children: "Analytics" })] })] })] })] }) }));
};
//# sourceMappingURL=DashboardPage.js.map