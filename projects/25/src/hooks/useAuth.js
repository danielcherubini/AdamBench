import { useState, useCallback } from 'react';
export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const login = useCallback(async (credentials) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        if (credentials.email === 'user@example.com' && credentials.password === 'password123') {
            setUser({ id: '1', email: 'user@example.com', name: 'John Doe' });
            setIsLoading(false);
            return true;
        }
        setIsLoading(false);
        return false;
    }, []);
    const logout = useCallback(() => {
        setUser(null);
    }, []);
    const updateProfile = useCallback(async (update) => {
        if (!user)
            return false;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        if (update.email && !update.email.includes('@')) {
            setIsLoading(false);
            return false;
        }
        setUser(prev => prev ? { ...prev, ...update } : null);
        setIsLoading(false);
        return true;
    }, [user]);
    return {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateProfile,
    };
};
//# sourceMappingURL=useAuth.js.map