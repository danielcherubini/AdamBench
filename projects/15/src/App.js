import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SnakeGamePage } from './pages/SnakeGamePage';
import './index.css';
// Protected route check
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading)
        return _jsx("div", { children: "Loading..." });
    return isAuthenticated ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/login", replace: true });
};
// Public route check
const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading)
        return _jsx("div", { children: "Loading..." });
    return !isAuthenticated ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/dashboard", replace: true });
};
const AppContent = () => {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(PublicRoute, { children: _jsx(LoginPage, {}) }) }), _jsx(Route, { path: "/dashboard", element: _jsx(PrivateRoute, { children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/profile", element: _jsx(PrivateRoute, { children: _jsx(ProfilePage, {}) }) }), _jsx(Route, { path: "/game", element: _jsx(SnakeGamePage, {}) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/dashboard", replace: true }) })] }));
};
const App = () => {
    return (_jsx(AuthProvider, { children: _jsx(BrowserRouter, { children: _jsx(AppContent, {}) }) }));
};
export default App;
//# sourceMappingURL=App.js.map