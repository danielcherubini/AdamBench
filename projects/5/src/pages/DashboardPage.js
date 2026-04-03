import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../hooks/useAuth';
import { AuthButton } from '../components/AuthButton';
import { Link } from 'react-router-dom';
import { useState } from 'react';
export const DashboardPage = () => {
    const { user } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    if (!user) {
        return null; // This should never happen due to ProtectedRoute, but just in case
    }
    const dashboardCards = [
        {
            title: 'Analytics',
            description: 'View your data insights',
            icon: '📊',
            color: 'bg-blue-500'
        },
        {
            title: 'Users',
            description: 'Manage user accounts',
            icon: '👥',
            color: 'bg-green-500'
        },
        {
            title: 'Security',
            description: 'Monitor security settings',
            icon: '🔒',
            color: 'bg-yellow-500'
        },
        {
            title: 'Settings',
            description: 'Configure your preferences',
            icon: '⚙️',
            color: 'bg-purple-500'
        }
    ];
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsxs("nav", { className: "bg-white shadow-sm border-b border-gray-200", children: [_jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between h-16", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("h1", { className: "text-xl font-semibold text-gray-900", children: "Dashboard" }), _jsxs("div", { className: "hidden md:flex ml-6 space-x-4", children: [_jsx(Link, { to: "/dashboard", className: "text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium", children: "Dashboard" }), _jsx(Link, { to: "/profile", className: "text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium", children: "Profile" })] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "md:hidden", children: _jsx("button", { onClick: () => setMobileMenuOpen(!mobileMenuOpen), className: "text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 p-2", children: _jsx("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: mobileMenuOpen ? (_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })) : (_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" })) }) }) }), _jsx("div", { className: "hidden md:block ml-4", children: _jsx(AuthButton, { variant: "secondary", size: "sm" }) })] })] }) }), mobileMenuOpen && (_jsx("div", { className: "md:hidden", children: _jsxs("div", { className: "px-2 pt-2 pb-3 space-y-1 sm:px-3", children: [_jsx(Link, { to: "/dashboard", className: "text-gray-500 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium", onClick: () => setMobileMenuOpen(false), children: "Dashboard" }), _jsx(Link, { to: "/profile", className: "text-gray-500 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium", onClick: () => setMobileMenuOpen(false), children: "Profile" }), _jsx("div", { className: "border-t border-gray-200 pt-4 pb-3", children: _jsx(AuthButton, { variant: "secondary", size: "sm", fullwidth: true }) })] }) }))] }), _jsx("main", { className: "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8", children: _jsx("div", { className: "px-4 py-6 sm:px-0", children: _jsx("div", { className: "border-4 border-dashed border-gray-200 rounded-lg p-6", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-lg font-medium text-gray-900 mb-4", children: "Welcome to Your Dashboard" }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-8", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "User Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("span", { className: "text-sm font-medium text-gray-500", children: "Name:" }), _jsx("p", { className: "text-sm text-gray-900", children: user.name })] }), _jsxs("div", { children: [_jsx("span", { className: "text-sm font-medium text-gray-500", children: "Email:" }), _jsx("p", { className: "text-sm text-gray-900", children: user.email })] }), _jsxs("div", { children: [_jsx("span", { className: "text-sm font-medium text-gray-500", children: "User ID:" }), _jsx("p", { className: "text-sm text-gray-900", children: user.id })] }), _jsxs("div", { children: [_jsx("span", { className: "text-sm font-medium text-gray-500", children: "Status:" }), _jsx("p", { className: "text-sm text-green-600", children: "Authenticated" })] })] })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8", children: dashboardCards.map((card, index) => (_jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsx("div", { className: "px-4 py-5 sm:p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `flex-shrink-0 rounded-md p-3 ${card.color}`, children: _jsx("span", { className: "text-white text-xl", children: card.icon }) }), _jsxs("div", { className: "ml-4", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: card.title }), _jsx("p", { className: "text-sm text-gray-500", children: card.description })] })] }) }) }, index))) }), _jsxs("div", { className: "mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6", children: [_jsx("h3", { className: "text-lg font-medium text-blue-900 mb-2", children: "Getting Started" }), _jsx("p", { className: "text-blue-700", children: "This is a demo dashboard built with React + TypeScript. You can customize this page with your actual application features and components." })] })] }) }) }) })] }));
};
//# sourceMappingURL=DashboardPage.js.map