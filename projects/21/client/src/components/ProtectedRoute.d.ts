/**
 * Protected Route Component
 * Wraps routes that require authentication
 */
interface RouteOptions {
    requireAuth?: boolean;
    requireRole?: 'admin' | 'user';
}
export declare const ProtectedRoute: ({ requireAuth }: RouteOptions) => any;
export declare const RequireAdmin: () => any;
export declare const RequireNonAdmin: () => any;
export {};
//# sourceMappingURL=ProtectedRoute.d.ts.map