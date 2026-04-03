import { useState, useCallback, useEffect } from 'react';
import { AuthService } from '../services/AuthService';
export function useAuth() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const updateUser = useCallback((user) => {
        setUser(user);
    }, []);
    const restoreSession = useCallback(async () => {
        try {
            const restoredUser = await AuthService.restoreSession();
            updateUser(restoredUser);
        }
        catch (error) {
            console.error('Failed to restore session:', error);
            updateUser(null);
        }
        finally {
            setIsLoading(false);
        }
    }, [updateUser]);
    useEffect(() => {
        restoreSession();
    }, [restoreSession]);
    const login = useCallback(async (email, password) => {
        setIsLoading(true);
        try {
            const user = await AuthService.login(email, password);
            updateUser(user);
        }
        finally {
            setIsLoading(false);
        }
    }, [updateUser]);
    const register = useCallback(async (email, password, name) => {
        setIsLoading(true);
        try {
            const user = await AuthService.register(email, password, name);
            updateUser(user);
        }
        finally {
            setIsLoading(false);
        }
    }, [updateUser]);
    const updateProfile = useCallback(async (name, email) => {
        setIsLoading(true);
        try {
            if (!user) {
                throw new Error('No user logged in');
            }
            const updatedUser = await AuthService.updateProfile({
                ...user,
                name,
                email,
            });
            updateUser(updatedUser);
        }
        finally {
            setIsLoading(false);
        }
    }, [user, updateUser]);
    const logout = useCallback(() => {
        AuthService.logout();
        updateUser(null);
    }, [updateUser]);
    return {
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
    };
}
//# sourceMappingURL=useAuth.js.map