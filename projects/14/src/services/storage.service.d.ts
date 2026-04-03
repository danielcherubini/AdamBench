/**
 * Storage service for managing user authentication state
 * This separates storage logic from business logic for better testability
 */
export declare const StorageService: {
    /**
     * Get user from storage
     */
    getUser: () => any | null;
    /**
     * Set user in storage
     */
    setUser: (user: any) => void;
    /**
     * Remove user from storage
     */
    removeUser: () => void;
    /**
     * Check if user is authenticated
     */
    isAuthenticated: () => boolean;
    /**
     * Clear all storage
     */
    clearStorage: () => void;
    /**
     * Simulate checking storage with a small delay
     */
    checkAuth: () => Promise<boolean>;
};
//# sourceMappingURL=storage.service.d.ts.map