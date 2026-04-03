/**
 * Authentication Context
 * Provides authentication state and methods to the app
 */
import React, { ReactNode } from 'react';
import { AuthContextValue } from '../types/auth';
export declare const AuthProvider: React.FC<{
    children: ReactNode;
}>;
export declare const useAuth: () => AuthContextValue;
//# sourceMappingURL=AuthContext.d.ts.map