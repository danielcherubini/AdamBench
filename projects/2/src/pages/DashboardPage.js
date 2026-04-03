import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../context/AuthContext';
import styles from './DashboardPage.module.css';
const DashboardPage = () => {
    const { user, logout } = useAuth();
    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
        }
    };
    return (_jsxs("div", { className: styles.container, children: [_jsxs("header", { className: styles.header, children: [_jsx("h1", { className: styles.title, children: "Dashboard" }), _jsxs("div", { className: styles.headerActions, children: [_jsxs("span", { className: styles.welcome, children: ["Welcome, ", _jsx("strong", { children: user?.name })] }), _jsx("button", { className: styles.logoutButton, onClick: handleLogout, children: "Logout" })] })] }), _jsxs("main", { className: styles.main, children: [_jsxs("section", { className: styles.welcomeSection, children: [_jsx("h2", { className: styles.welcomeHeading, children: "Welcome to your Dashboard!" }), _jsx("p", { className: styles.welcomeText, children: "This is a protected page. Only authenticated users can access this content." })] }), _jsxs("section", { className: styles.cards, children: [_jsxs("div", { className: styles.card, children: [_jsx("div", { className: styles.cardIcon, children: "\uD83D\uDCE7" }), _jsx("h3", { className: styles.cardTitle, children: "Email" }), _jsx("p", { className: styles.cardValue, children: user?.email })] }), _jsxs("div", { className: styles.card, children: [_jsx("div", { className: styles.cardIcon, children: "\uD83D\uDC64" }), _jsx("h3", { className: styles.cardTitle, children: "Name" }), _jsx("p", { className: styles.cardValue, children: user?.name })] }), _jsxs("div", { className: styles.card, children: [_jsx("div", { className: styles.cardIcon, children: "\uD83D\uDD12" }), _jsx("h3", { className: styles.cardTitle, children: "Status" }), _jsx("p", { className: styles.cardValue, children: "Authenticated" })] })] }), _jsxs("section", { className: styles.info, children: [_jsx("h3", { className: styles.infoTitle, children: "About this demo" }), _jsx("p", { className: styles.infoText, children: "This is a React + TypeScript application with fake authentication. It demonstrates protected routes, React Context for state management, and React Router for navigation." })] })] })] }));
};
export default DashboardPage;
//# sourceMappingURL=DashboardPage.js.map