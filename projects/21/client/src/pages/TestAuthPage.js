import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Test Page to verify auth state
 */
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../utils/authService';
import { clearAuth } from '../utils/authStorage';
export const TestAuthPage = () => {
    const { isAuthenticated, user, isLoading } = useAuth();
    useEffect(() => {
        console.log('TestAuthPage - Mounted');
        console.log('TestAuthPage - isAuthenticated:', isAuthenticated);
        console.log('TestAuthPage - user:', user);
        console.log('TestAuthPage - authService.getCurrentUser():', authService.getCurrentUser());
        console.log('TestAuthPage - localStorage auth_user:', localStorage.getItem('auth_user'));
        console.log('TestAuthPage - localStorage mock_users:', localStorage.getItem('mock_users'));
        // Clear auth and reload
        clearAuth();
        console.log('TestAuthPage - Auth cleared, reloading...');
        window.location.reload();
    }, []);
    return (_jsxs("div", { style: { padding: '2rem', textAlign: 'center' }, children: [_jsx("h1", { children: "Auth Test Page" }), _jsxs("p", { children: ["isAuthenticated: ", isAuthenticated] }), _jsxs("p", { children: ["user: ", user?.email || 'null'] }), _jsxs("p", { children: ["isLoading: ", isLoading] })] }));
};
export default TestAuthPage;
//# sourceMappingURL=TestAuthPage.js.map