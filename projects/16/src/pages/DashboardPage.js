import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';
import { Layout } from '../Layout';
export const DashboardPage = () => {
    const { user, logout } = useAuth();
    return (_jsxs(Layout, { children: [_jsx("h1", { children: "Dashboard" }), _jsxs("p", { children: ["Welcome, ", _jsx("strong", { children: user?.name }), "."] }), _jsxs("p", { className: "muted", children: ["Signed in as ", user?.email] }), _jsxs("p", { className: "muted small", children: ["Manage your account in ", _jsx(Link, { to: "/profile", children: "profile" }), "."] }), _jsx("button", { type: "button", onClick: logout, children: "Logout" })] }));
};
//# sourceMappingURL=DashboardPage.js.map