import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const DashboardPage = () => {
    const navigate = useNavigate();
    const [stats] = useState([
        {
            title: 'Total Users',
            value: '12,847',
            change: '+12.5%',
            changeType: 'positive',
        },
        {
            title: 'Revenue',
            value: '$45,231',
            change: '+8.2%',
            changeType: 'positive',
        },
        {
            title: 'Active Sessions',
            value: '1,432',
            change: '-3.1%',
            changeType: 'negative',
        },
        {
            title: 'Conversion Rate',
            value: '3.24%',
            change: '+0.8%',
            changeType: 'positive',
        },
    ]);
    const [recentActivity] = useState([
        { id: 1, action: 'New user registration', user: 'Alice Johnson', time: '2 minutes ago' },
        { id: 2, action: 'Order completed', user: 'Bob Smith', time: '15 minutes ago' },
        { id: 3, action: 'Password reset requested', user: 'Carol White', time: '1 hour ago' },
        { id: 4, action: 'New subscription', user: 'David Brown', time: '2 hours ago' },
    ]);
    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "md:flex md:items-center md:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Dashboard" }), _jsx("p", { className: "mt-1 text-sm text-gray-600", children: "Welcome back! Here's what's happening with your account." })] }), _jsx("div", { className: "mt-4 md:mt-0", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: formatTime(currentTime) }), _jsx("p", { className: "text-xs text-gray-500", children: formatDate(currentTime) })] }), _jsx("div", { className: "h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold", children: currentTime.getHours() })] }) })] }), _jsx("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4", children: stats.map((stat) => (_jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsxs("div", { className: "px-4 py-5 sm:p-6", children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: stat.title }), _jsx("dd", { className: "mt-1 text-3xl font-semibold text-gray-900", children: stat.value }), stat.change && (_jsxs("dd", { className: `mt-1 text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`, children: [stat.changeType === 'positive' ? '↑' : '↓', " ", stat.change] }))] }) }, stat.title))) }), _jsxs("div", { className: "bg-white shadow rounded-lg", children: [_jsx("div", { className: "px-4 py-5 sm:px-6", children: _jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: "Quick Actions" }) }), _jsx("div", { className: "border-t border-gray-200 px-4 py-4 sm:p-6", children: _jsxs("button", { onClick: () => navigate('/profile'), className: "w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: [_jsx("svg", { className: "h-5 w-5 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }), "Go to Profile Settings"] }) })] }), _jsxs("div", { className: "bg-white shadow rounded-lg", children: [_jsx("div", { className: "px-4 py-5 sm:px-6", children: _jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: "Recent Activity" }) }), _jsx("div", { className: "border-t border-gray-200", children: _jsx("ul", { className: "divide-y divide-gray-200", children: recentActivity.map((activity) => (_jsx("li", { className: "px-4 py-4 sm:px-6 hover:bg-gray-50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-indigo-600 font-medium text-sm", children: activity.user.charAt(0) }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: activity.action }), _jsxs("p", { className: "text-sm text-gray-500", children: ["by ", activity.user] })] })] }), _jsx("div", { className: "ml-2 flex-shrink-0", children: _jsx("p", { className: "text-sm text-gray-500", children: activity.time }) })] }) }, activity.id))) }) })] })] }));
};
export default DashboardPage;
//# sourceMappingURL=DashboardPage.js.map