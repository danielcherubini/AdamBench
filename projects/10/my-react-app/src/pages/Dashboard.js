import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
const DashboardPage = () => {
    const { user, logout } = useAuth();
    const handleLogout = () => {
        logout();
    };
    return (_jsxs("div", { style: { padding: '2rem' }, children: [_jsx("h2", { children: "Dashboard" }), _jsxs("p", { children: ["Welcome, ", user?.name ?? 'User', "!"] }), _jsx("button", { onClick: handleLogout, children: "Logout" }), _jsx(Link, { to: "/profile", children: "Edit Profile" })] }));
};
export default DashboardPage;
//# sourceMappingURL=Dashboard.js.map