import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
function Welcome() {
    const { isAuthenticated } = useAuth();
    return (_jsx("div", { style: styles.container, children: _jsxs("div", { style: styles.card, children: [_jsx("h1", { style: styles.title, children: "Welcome to React Auth App" }), _jsx("p", { style: styles.subtitle, children: "A simple authentication demo with a fun Snake game" }), _jsxs("div", { style: styles.features, children: [_jsxs("div", { style: styles.featureCard, children: [_jsx("div", { style: styles.featureIcon, children: "\uD83D\uDD10" }), _jsx("h2", { style: styles.featureTitle, children: "Authentication" }), _jsx("p", { style: styles.featureText, children: "Secure login and registration system with protected routes" })] }), _jsxs("div", { style: styles.featureCard, children: [_jsx("div", { style: styles.featureIcon, children: "\uD83D\uDC0D" }), _jsx("h2", { style: styles.featureTitle, children: "Snake Game" }), _jsx("p", { style: styles.featureText, children: "Play the classic Snake game - no login required!" })] }), _jsxs("div", { style: styles.featureCard, children: [_jsx("div", { style: styles.featureIcon, children: "\u2699\uFE0F" }), _jsx("h2", { style: styles.featureTitle, children: "Profile" }), _jsx("p", { style: styles.featureText, children: "Edit your profile information after logging in" })] })] }), _jsxs("div", { style: styles.actions, children: [_jsx(Link, { to: "/login", style: styles.primaryButton, children: "Login / Sign Up" }), _jsx(Link, { to: "/snake", style: styles.secondaryButton, children: "Play Snake Game" })] }), isAuthenticated && (_jsx("div", { style: styles.dashboardLink, children: _jsx(Link, { to: "/dashboard", style: styles.dashboardLinkText, children: "Go to Dashboard \u2192" }) }))] }) }));
}
export default Welcome;
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        padding: '48px',
        width: '100%',
        maxWidth: '800px',
        textAlign: 'center',
    },
    title: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '12px',
    },
    subtitle: {
        fontSize: '18px',
        color: '#666',
        marginBottom: '40px',
    },
    features: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        marginBottom: '40px',
    },
    featureCard: {
        padding: '24px',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa',
    },
    featureIcon: {
        fontSize: '48px',
        marginBottom: '16px',
    },
    featureTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '8px',
    },
    featureText: {
        fontSize: '14px',
        color: '#666',
        lineHeight: '1.5',
    },
    actions: {
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    primaryButton: {
        padding: '14px 32px',
        backgroundColor: '#1976d2',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '500',
        transition: 'background-color 0.2s',
    },
    secondaryButton: {
        padding: '14px 32px',
        backgroundColor: '#4CAF50',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '500',
        transition: 'background-color 0.2s',
    },
    dashboardLink: {
        marginTop: '24px',
    },
    dashboardLinkText: {
        color: '#1976d2',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
    },
};
//# sourceMappingURL=Welcome.js.map