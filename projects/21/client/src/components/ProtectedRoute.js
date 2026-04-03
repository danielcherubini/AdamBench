import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Protected Route Component
 * Wraps routes that require authentication
 */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export const ProtectedRoute = ({ requireAuth = true }) => {
    const { isAuthenticated } = useAuth();
    if (!requireAuth && isAuthenticated) {
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    if (!isAuthenticated && requireAuth) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(Outlet, {});
};
export const RequireAdmin = () => {
    const { isAuthenticated, user } = useAuth();
    if (!isAuthenticated || user?.role !== 'admin') {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return _jsx(Outlet, {});
};
export const RequireNonAdmin = () => {
    const { isAuthenticated, user } = useAuth();
    if (!isAuthenticated || user?.role === 'admin') {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return _jsx(Outlet, {});
};
//# sourceMappingURL=ProtectedRoute.js.map