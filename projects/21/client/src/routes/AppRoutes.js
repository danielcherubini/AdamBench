import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Application Routes
 * Defines all routes and their protected route requirements
 */
import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { PublicRoute, ProtectedRoute } from './routeComponents';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { ProfilePage } from '../pages/ProfilePage';
import { TestAuthPage } from '../pages/TestAuthPage';
export const AppRoutes = () => {
    return (_jsxs(RouterRoutes, { children: [_jsx(Route, { path: "/test-auth", element: _jsx(PublicRoute, { children: _jsx(TestAuthPage, {}) }) }), _jsx(Route, { path: "/login", element: _jsx(PublicRoute, { children: _jsx(LoginPage, {}) }) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/admin", element: _jsx(ProtectedRoute, { children: _jsx(AdminDashboardPage, {}) }) }), _jsx(Route, { path: "/profile", element: _jsx(ProtectedRoute, { children: _jsx(ProfilePage, {}) }) }), _jsx(Route, { path: "*", element: _jsx("div", { style: { padding: '2rem' }, children: "404 - Page Not Found" }) })] }));
};
export default AppRoutes;
//# sourceMappingURL=AppRoutes.js.map