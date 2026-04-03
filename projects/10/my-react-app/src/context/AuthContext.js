import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const login = () => {
        authService.login();
        navigate('/dashboard');
    };
    const logout = () => {
        authService.logout();
        navigate('/login');
    };
    const updateProfile = (partial) => {
        authService.updateProfile(partial);
    };
    const { user, isAuthenticated } = authService.getState();
    return (_jsx(AuthContext.Provider, { value: { user, isAuthenticated, login, logout, updateProfile }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
//# sourceMappingURL=AuthContext.js.map