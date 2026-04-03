import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
export const ProtectedRoute = ({ requiresAuth = true }) => {
    const { isAuthenticated, isLoading } = useAuth(null, 0);
    if (isLoading) {
        return (_jsxs("div", { className: "auth-loading", children: [_jsx("div", { className: "spinner" }), _jsx("p", { children: "Loading..." })] }));
    }
    if (requiresAuth && !isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (!requiresAuth && isAuthenticated) {
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    return _jsx(Outlet, {});
};
//# sourceMappingURL=ProtectedRoute.js.map