import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AppLayout } from "../AppLayout";
const STATS = [
    { label: "Projects", value: "12", icon: "📁", delta: "+2 this week" },
    { label: "Tasks Done", value: "84", icon: "✅", delta: "+9 today" },
    { label: "Team Members", value: "6", icon: "👥", delta: "No change" },
    { label: "Reports", value: "3", icon: "📊", delta: "+1 this month" },
];
const ACTIVITY = [
    { id: 1, action: "Deployed v2.1.0 to production", time: "2 min ago", icon: "🚀" },
    { id: 2, action: "Merged pull request #42", time: "1 hr ago", icon: "🔀" },
    { id: 3, action: "Created new project 'Alpha'", time: "3 hr ago", icon: "📁" },
    { id: 4, action: "Updated team settings", time: "Yesterday", icon: "⚙️" },
    { id: 5, action: "Invited bob@example.com", time: "2 days ago", icon: "✉️" },
];
export function DashboardPage() {
    const { user } = useAuth();
    return (_jsxs(AppLayout, { children: [_jsxs("div", { className: "dashboard-header", children: [_jsxs("h2", { children: ["Good morning, ", user?.name?.split(" ")[0], " \uD83D\uDC4B"] }), _jsx("p", { className: "dashboard-subtitle", children: "Here's what's happening with your projects today." })] }), _jsx("section", { className: "stats-grid", children: STATS.map((stat) => (_jsxs("div", { className: "stat-card", children: [_jsxs("div", { className: "stat-top", children: [_jsx("span", { className: "stat-icon", children: stat.icon }), _jsx("span", { className: "stat-value", children: stat.value })] }), _jsx("p", { className: "stat-label", children: stat.label }), _jsx("p", { className: "stat-delta", children: stat.delta })] }, stat.label))) }), _jsxs("section", { className: "activity-card", children: [_jsx("h3", { children: "Recent Activity" }), _jsx("ul", { className: "activity-list", children: ACTIVITY.map((item) => (_jsxs("li", { className: "activity-item", children: [_jsx("span", { className: "activity-icon", children: item.icon }), _jsxs("div", { className: "activity-content", children: [_jsx("p", { className: "activity-action", children: item.action }), _jsx("p", { className: "activity-time", children: item.time })] })] }, item.id))) })] }), _jsxs("section", { className: "profile-card", children: [_jsxs("div", { className: "profile-card-header", children: [_jsx("h3", { children: "Your Profile" }), _jsx(Link, { to: "/profile", className: "profile-edit-link", children: "Edit \u2192" })] }), _jsxs("div", { className: "profile-body", children: [_jsx("div", { className: "avatar avatar-lg", children: user?.avatarInitials }), _jsxs("div", { children: [_jsx("p", { className: "profile-name", children: user?.name }), _jsx("p", { className: "profile-email", children: user?.email }), _jsx("span", { className: "badge", children: "Active" })] })] })] })] }));
}
//# sourceMappingURL=DashboardPage.js.map