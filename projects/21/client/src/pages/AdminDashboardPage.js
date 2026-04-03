import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Admin Dashboard Page Component
 * Admin-only dashboard with restricted features
 */
import { useAuth } from '../context/AuthContext';
const adminCards = [
    { title: 'User Management', description: 'Manage all users in the system' },
    { title: 'System Settings', description: 'Configure system-wide settings' },
    { title: 'Activity Logs', description: 'View all user activity' },
    { title: 'Security', description: 'Manage security settings' },
];
export const AdminDashboardPage = () => {
    const { user, isAuthenticated } = useAuth();
    if (!isAuthenticated || user?.role !== 'admin') {
        return null;
    }
    return (_jsx("div", { className: "admin-dashboard-page", children: _jsxs("div", { className: "admin-dashboard-container", children: [_jsxs("header", { className: "admin-header", children: [_jsx("h1", { children: "Admin Dashboard" }), _jsx("div", { className: "admin-badge", children: "Admin Access" })] }), _jsxs("div", { className: "admin-content", children: [_jsx("div", { className: "admin-cards", children: adminCards.map((card) => (_jsxs("div", { className: "admin-card", children: [_jsx("h3", { children: card.title }), _jsx("p", { children: card.description })] }, card.title))) }), _jsxs("div", { className: "admin-section", children: [_jsx("h3", { children: "Admin Features" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 Create and manage users" }), _jsx("li", { children: "\u2705 Assign roles and permissions" }), _jsx("li", { children: "\u2705 View system-wide analytics" }), _jsx("li", { children: "\u2705 Manage security settings" })] })] })] })] }) }));
};
//# sourceMappingURL=AdminDashboardPage.js.map