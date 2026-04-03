import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
export const ProtectedRoute = ({ children }) => {
    const isAuthenticated = authService.getState().isAuthenticated;
    return isAuthenticated ? children : _jsx(Navigate, { to: "/login", replace: true });
};
//# sourceMappingURL=ProtectedRoute.js.map