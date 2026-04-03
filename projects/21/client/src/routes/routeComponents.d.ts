/**
 * Route Components
 * Provides protected route wrappers for authentication
 */
import React, { ReactNode } from 'react';
/**
 * PublicRoute - Redirects to login if already authenticated
 */
export declare const PublicRoute: React.FC<{
    children: ReactNode;
}>;
/**
 * ProtectedRoute - Redirects to login if not authenticated
 */
export declare const ProtectedRoute: React.FC<{
    children: ReactNode;
}>;
//# sourceMappingURL=routeComponents.d.ts.map