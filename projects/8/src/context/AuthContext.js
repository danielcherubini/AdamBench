import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, ReactNode } from 'react';
// Fake users
const FAKE_USERS = {
    admin: {
        password: 'admin123',
        user: { id: '1', username: 'admin', email: 'admin@example.com', role: 'admin' },
    },
    user: {
        password: 'user123',
        user: { id: '2', username: 'user', email: 'user@example.com', role: 'user' },
    },
};
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const login = async (username, password) => {
        const fakeUser = FAKE_USERS[username];
        if (fakeUser && fakeUser.password === password) {
            setUser(fakeUser.user);
            return true;
        }
        return false;
    };
    const logout = () => setUser(null);
    return (_jsx(AuthContext.Provider, { value: { user, login, logout, isAuthenticated: !!user }, children: children }));
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
//# sourceMappingURL=AuthContext.js.map