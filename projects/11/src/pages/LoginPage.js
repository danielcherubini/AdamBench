import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/LoginForm';
const LoginPage = () => {
    const navigate = useNavigate();
    const { login, isLoading } = useAuth();
    const handleLogin = async (email, password) => {
        const response = await login({ email, password });
        if (response.success) {
            navigate('/dashboard');
        }
        return response;
    };
    return _jsx(LoginForm, { onLogin: handleLogin, isLoading: isLoading });
};
export default LoginPage;
//# sourceMappingURL=LoginPage.js.map