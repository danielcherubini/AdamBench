import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context';
export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthContext();
    const location = useLocation();
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
//# sourceMappingURL=ProtectedRoute.js.map