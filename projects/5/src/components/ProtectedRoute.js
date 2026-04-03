import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" }) }));
    }
    return isAuthenticated ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/login", replace: true });
};
//# sourceMappingURL=ProtectedRoute.js.map