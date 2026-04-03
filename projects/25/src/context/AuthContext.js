import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => (_jsx(AuthContext.Provider, { value: useAuth(), children: children }));
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuthContext must be used within AuthProvider');
    return context;
};
//# sourceMappingURL=AuthContext.js.map