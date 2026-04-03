import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    if (isLoading) {
        return (_jsx("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }, children: _jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: '24px', fontWeight: 600, color: '#0066cc', marginBottom: 8 }, children: "OmniCoder" }), _jsx("p", { style: { color: '#6b7280' }, children: "Loading..." })] }) }));
    }
    if (!isAuthenticated) {
        // Redirect to login with return URL
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
//# sourceMappingURL=ProtectedRoute.js.map