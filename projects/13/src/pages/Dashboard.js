import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../hooks/useAuth';
import { Navigation } from '../components/Navigation';
export function Dashboard() {
    // Use the refactored auth hook
    const { user, logout, clearSession } = useAuth();
    const stats = [
        { label: 'Total Projects', value: '24', icon: '📁' },
        { label: 'Completed Tasks', value: '156', icon: '✅' },
        { label: 'Hours Worked', value: '184', icon: '⏱️' },
        { label: 'Efficiency Score', value: '94%', icon: '⭐' },
    ];
    const recentProjects = [
        { id: '1', name: 'E-commerce Platform', status: 'In Progress', progress: 65 },
        { id: '2', name: 'Mobile App', status: 'Completed', progress: 100 },
        { id: '3', name: 'API Integration', status: 'Pending', progress: 0 },
        { id: '4', name: 'Dashboard UI', status: 'In Progress', progress: 45 },
    ];
    return (_jsxs("div", { className: "container", style: { paddingTop: '24px' }, children: [_jsx(Navigation, {}), _jsxs("div", { className: "header", children: [_jsx("div", { className: "header-title", children: "OmniCoder Dashboard" }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '12px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx("img", { src: user?.avatar, alt: user?.name, style: {
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                        } }), _jsx("span", { style: { fontWeight: 500 }, children: user?.name })] }), _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsx("button", { onClick: clearSession, className: "btn btn-secondary", children: "Clear Session" }), _jsx("button", { onClick: logout, className: "btn btn-danger", children: "Logout" })] })] })] }), _jsxs("div", { style: { display: 'grid', gap: '24px', marginTop: '24px' }, children: [_jsx("div", { className: "grid grid-2", style: { gridTemplateColumns: 'repeat(4, 1fr)' }, children: stats.map((stat) => (_jsxs("div", { className: "stat-card", children: [_jsx("div", { style: { fontSize: '28px', marginBottom: '8px' }, children: stat.icon }), _jsx("div", { className: "stat-label", children: stat.label }), _jsx("div", { className: "stat-value", children: stat.value })] }, stat.label))) }), _jsxs("div", { className: "grid grid-2", style: { gridTemplateColumns: '2fr 1fr' }, children: [_jsxs("div", { className: "card", children: [_jsx("h2", { style: { fontSize: '18px', fontWeight: 600, marginBottom: '20px' }, children: "Recent Projects" }), recentProjects.map((project) => (_jsxs("div", { style: { marginBottom: '16px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }, children: [_jsx("span", { style: { fontWeight: 500 }, children: project.name }), _jsx("span", { style: {
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            backgroundColor: project.status === 'Completed' ? '#d1fae5' : project.status === 'In Progress' ? '#dbeafe' : '#fef3c7',
                                                            color: project.status === 'Completed' ? '#065f46' : project.status === 'In Progress' ? '#1e40af' : '#92400e',
                                                        }, children: project.status })] }), _jsxs("div", { style: { marginBottom: '8px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6b7280' }, children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [project.progress, "%"] })] }), _jsx("div", { style: { height: '8px', borderRadius: '4px', background: '#e5e7eb', overflow: 'hidden' }, children: _jsx("div", { style: {
                                                                height: '100%',
                                                                width: `${project.progress}%`,
                                                                background: project.status === 'Completed' ? '#10b981' : project.status === 'In Progress' ? '#3b82f6' : '#f59e0b',
                                                                borderRadius: '4px',
                                                                transition: 'width 0.3s ease',
                                                            } }) })] })] }, project.id)))] }), _jsxs("div", { className: "card", children: [_jsx("h2", { style: { fontSize: '18px', fontWeight: 600, marginBottom: '20px' }, children: "Recent Activity" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '12px' }, children: [
                                            { time: '2 hours ago', action: 'Completed task', project: 'E-commerce Platform' },
                                            { time: '5 hours ago', action: 'Updated project', project: 'Mobile App' },
                                            { time: '1 day ago', action: 'Created new project', project: 'API Integration' },
                                            { time: '2 days ago', action: 'Completed sprint', project: 'Dashboard UI' },
                                        ].map((activity, index) => (_jsxs("div", { style: { display: 'flex', gap: '12px', paddingBottom: '12px', borderBottom: index < 3 ? '1px solid #e5e7eb' : 'none' }, children: [_jsx("div", { style: {
                                                        width: '8px',
                                                        height: '8px',
                                                        borderRadius: '50%',
                                                        background: '#0066cc',
                                                        flexShrink: 0,
                                                    } }), _jsxs("div", { children: [_jsxs("p", { style: { fontSize: '14px', marginBottom: '4px' }, children: [_jsx("span", { style: { fontWeight: 500 }, children: activity.action }), _jsxs("span", { style: { color: '#6b7280' }, children: [" on ", activity.project] })] }), _jsx("span", { style: { fontSize: '12px', color: '#9ca3af' }, children: activity.time })] })] }, index))) })] })] })] })] }));
}
//# sourceMappingURL=Dashboard.js.map