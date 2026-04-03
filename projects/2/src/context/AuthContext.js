import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
const AuthContext = createContext(undefined);
const MOCK_USERS = [
    { email: 'user@example.com', password: 'password123', name: 'Test User' },
    { email: 'admin@example.com', password: 'admin123', name: 'Admin User' },
];
const AUTH_TOKEN_KEY = 'auth_token';
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
            try {
                setUser(JSON.parse(token));
            }
            catch {
                localStorage.removeItem(AUTH_TOKEN_KEY);
            }
        }
        setIsLoading(false);
    }, []);
    const login = async (email, password) => {
        const mockUser = MOCK_USERS.find((u) => u.email === email && u.password === password);
        if (!mockUser) {
            throw new Error('Invalid email or password');
        }
        const user = {
            id: Math.random().toString(36).substr(2, 9),
            email: mockUser.email,
            name: mockUser.name,
        };
        localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(user));
        setUser(user);
    };
    const logout = () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setUser(null);
    };
    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
export default AuthContext;
//# sourceMappingURL=AuthContext.js.map