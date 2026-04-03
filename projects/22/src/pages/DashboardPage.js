import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
export function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (_jsxs("div", { style: styles.container, children: [_jsxs("header", { style: styles.header, children: [_jsx("h1", { style: styles.logo, children: "MyApp" }), _jsxs("div", { style: styles.headerRight, children: [_jsxs("span", { style: styles.userName, children: ["Hello, ", user?.name] }), _jsx("button", { onClick: () => navigate('/profile'), style: styles.profileButton, children: "Profile" }), _jsx("button", { onClick: handleLogout, style: styles.logoutButton, children: "Logout" })] })] }), _jsxs("main", { style: styles.main, children: [_jsxs("div", { style: styles.card, children: [_jsx("h2", { style: styles.cardTitle, children: "Dashboard Overview" }), _jsxs("p", { style: styles.cardText, children: ["Welcome to your dashboard, ", user?.name, "! You are successfully logged in."] }), _jsxs("div", { style: styles.stats, children: [_jsxs("div", { style: styles.statCard, children: [_jsx("span", { style: styles.statValue, children: "24" }), _jsx("span", { style: styles.statLabel, children: "Projects" })] }), _jsxs("div", { style: styles.statCard, children: [_jsx("span", { style: styles.statValue, children: "156" }), _jsx("span", { style: styles.statLabel, children: "Tasks" })] }), _jsxs("div", { style: styles.statCard, children: [_jsx("span", { style: styles.statValue, children: "12" }), _jsx("span", { style: styles.statLabel, children: "Team Members" })] }), _jsxs("div", { style: styles.statCard, children: [_jsx("span", { style: styles.statValue, children: "98%" }), _jsx("span", { style: styles.statLabel, children: "Completion" })] })] })] }), _jsxs("div", { style: styles.card, children: [_jsx("h2", { style: styles.cardTitle, children: "Recent Activity" }), _jsxs("ul", { style: styles.activityList, children: [_jsxs("li", { style: styles.activityItem, children: [_jsx("span", { style: styles.activityDot }), _jsxs("div", { children: [_jsx("strong", { children: "Project Alpha" }), " updated", _jsx("span", { style: styles.activityTime, children: "2 hours ago" })] })] }), _jsxs("li", { style: styles.activityItem, children: [_jsx("span", { style: styles.activityDot }), _jsxs("div", { children: [_jsx("strong", { children: "New task" }), " assigned to you", _jsx("span", { style: styles.activityTime, children: "5 hours ago" })] })] }), _jsxs("li", { style: styles.activityItem, children: [_jsx("span", { style: styles.activityDot }), _jsxs("div", { children: [_jsx("strong", { children: "Meeting" }), " scheduled for tomorrow", _jsx("span", { style: styles.activityTime, children: "1 day ago" })] })] })] })] })] })] }));
}
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    logo: {
        margin: 0,
        fontSize: '24px',
        color: '#3498db',
        fontWeight: 700,
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    userName: {
        color: '#333',
        fontSize: '14px',
    },
    logoutButton: {
        padding: '8px 16px',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    profileButton: {
        padding: '8px 16px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    main: {
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    cardTitle: {
        margin: '0 0 16px 0',
        fontSize: '20px',
        color: '#333',
    },
    cardText: {
        color: '#666',
        marginBottom: '24px',
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
    },
    statCard: {
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        textAlign: 'center',
    },
    statValue: {
        display: 'block',
        fontSize: '32px',
        fontWeight: 700,
        color: '#3498db',
    },
    statLabel: {
        display: 'block',
        fontSize: '14px',
        color: '#666',
        marginTop: '4px',
    },
    activityList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    activityItem: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 0',
        borderBottom: '1px solid #eee',
    },
    activityDot: {
        width: '8px',
        height: '8px',
        backgroundColor: '#3498db',
        borderRadius: '50%',
        marginTop: '6px',
        flexShrink: 0,
    },
    activityTime: {
        display: 'block',
        fontSize: '12px',
        color: '#999',
        marginTop: '4px',
    },
};
//# sourceMappingURL=DashboardPage.js.map