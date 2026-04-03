import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Route Components
 * Provides protected route wrappers for authentication
 */
import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
/**
 * PublicRoute - Redirects to login if already authenticated
 */
export const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    console.log('PublicRoute - Component mounted');
    console.log('PublicRoute - isAuthenticated:', isAuthenticated);
    console.log('PublicRoute - children:', children?.type?.name);
    if (isAuthenticated) {
        console.log('PublicRoute - Redirecting to /dashboard');
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    console.log('PublicRoute - Rendering children');
    return _jsx(_Fragment, { children: children });
};
/**
 * ProtectedRoute - Redirects to login if not authenticated
 */
export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    console.log('ProtectedRoute - Component mounted');
    console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
    console.log('ProtectedRoute - children:', children?.type?.name);
    if (!isAuthenticated) {
        console.log('ProtectedRoute - Redirecting to /login');
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    console.log('ProtectedRoute - Rendering children');
    return _jsx(_Fragment, { children: children });
};
//# sourceMappingURL=routeComponents.js.map