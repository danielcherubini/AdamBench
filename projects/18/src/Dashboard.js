import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useAuth } from './auth';
export function Dashboard() {
    const { user, logout } = useAuth();
    return (_jsxs("div", { className: "dashboard-container", children: [_jsxs("header", { className: "dashboard-header", children: [_jsx("h1", { children: "Dashboard" }), _jsxs("div", { className: "header-actions", children: [_jsxs(Link, { to: "/profile", className: "profile-link", children: [_jsx("div", { className: "user-avatar", children: user?.name?.[0] || 'U' }), _jsx("span", { children: user?.name })] }), _jsx("button", { onClick: logout, className: "logout-button", children: "Sign Out" })] })] }), _jsxs("main", { className: "dashboard-content", children: [_jsxs("div", { className: "welcome-card", children: [_jsxs("h2", { children: ["Welcome, ", user?.name, "!"] }), _jsxs("p", { children: ["Logged in as ", user?.email] })] }), _jsx("div", { className: "stats-grid", children: [
                            { label: 'Projects', value: 12 },
                            { label: 'Tasks', value: 48 },
                            { label: 'Team Members', value: 8 },
                            { label: 'Completed', value: 156 },
                        ].map((s) => (_jsxs("div", { className: "stat-card", children: [_jsx("h3", { children: s.label }), _jsx("span", { className: "stat-number", children: s.value })] }, s.label))) }), _jsxs("div", { className: "recent-activity", children: [_jsx("h3", { children: "Recent Activity" }), _jsx("ul", { className: "activity-list", children: [
                                    { text: 'Project "Alpha" was created', time: '2 hours ago' },
                                    { text: 'Task #42 was completed', time: '4 hours ago' },
                                    { text: 'New team member joined', time: '1 day ago' },
                                    { text: 'Project "Beta" milestone reached', time: '2 days ago' },
                                ].map((a, i) => (_jsxs("li", { children: [_jsx("span", { className: "activity-dot" }), a.text, _jsx("span", { className: "activity-time", children: a.time })] }, i))) })] })] })] }));
}
//# sourceMappingURL=Dashboard.js.map