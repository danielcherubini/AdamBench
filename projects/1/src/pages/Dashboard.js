import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
function Dashboard() {
    const { user, logout } = useAuth();
    return (_jsxs("div", { style: styles.container, children: [_jsxs("header", { style: styles.header, children: [_jsx("h1", { style: styles.title, children: "Dashboard" }), _jsxs("div", { style: styles.headerActions, children: [_jsx(Link, { to: "/profile", style: styles.navLink, children: "Profile" }), _jsx("button", { onClick: logout, style: styles.logoutButton, children: "Logout" })] })] }), _jsxs("main", { style: styles.main, children: [_jsxs("div", { style: styles.card, children: [_jsxs("h2", { style: styles.cardTitle, children: ["Welcome, ", user?.name, "!"] }), _jsx("p", { style: styles.cardText, children: "You have successfully logged in. This is a protected route that only authenticated users can access." })] }), _jsxs("div", { style: styles.card, children: [_jsx("h2", { style: styles.cardTitle, children: "User Information" }), _jsxs("div", { style: styles.userInfo, children: [_jsxs("p", { children: [_jsx("strong", { children: "Email:" }), " ", user?.email] }), _jsxs("p", { children: [_jsx("strong", { children: "ID:" }), " ", user?.id] })] })] }), _jsxs("div", { style: styles.card, children: [_jsx("h2", { style: styles.cardTitle, children: "Quick Actions" }), _jsxs("div", { style: styles.actions, children: [_jsx(Link, { to: "/profile", style: styles.actionLink, children: "Edit Profile" }), _jsx("button", { style: styles.actionButton, children: "Settings" }), _jsx("button", { style: styles.actionButton, children: "Help" })] })] })] })] }));
}
export default Dashboard;
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
    },
    header: {
        backgroundColor: 'white',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#333',
    },
    headerActions: {
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
    },
    navLink: {
        color: '#1976d2',
        textDecoration: 'none',
        fontSize: '14px',
    },
    logoutButton: {
        padding: '8px 16px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    main: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        marginBottom: '24px',
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '16px',
    },
    cardText: {
        color: '#666',
        lineHeight: '1.6',
    },
    userInfo: {
        color: '#444',
        lineHeight: '2',
    },
    actions: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
    },
    actionLink: {
        padding: '10px 20px',
        backgroundColor: '#1976d2',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px',
        display: 'inline-block',
        fontSize: '14px',
    },
    actionButton: {
        padding: '10px 20px',
        backgroundColor: '#1976d2',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};
//# sourceMappingURL=Dashboard.js.map