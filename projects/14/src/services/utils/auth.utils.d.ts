/**
 * Format date to readable string
 */
export declare const formatDate: (date: Date | string) => string;
/**
 * Format duration to readable string
 */
export declare const formatDuration: (ms: number) => string;
/**
 * Generate activity text
 */
export declare const generateActivityText: (type: ActivityType, timestamp?: number) => string;
/**
 * Activity type enum
 */
export type ActivityType = 'dashboard_view' | 'email_received' | 'settings_changed' | 'login' | 'logout';
/**
 * Generate activity items
 */
export declare const generateActivities: (count?: number) => Array<{
    type: ActivityType;
    icon: string;
    text: string;
    time: string;
}>;
/**
 * Calculate stat value with random variation
 */
export declare const calculateStat: (base: number, variance?: number) => number;
/**
 * Format number with thousands separator
 */
export declare const formatNumber: (num: number) => string;
/**
 * Format currency
 */
export declare const formatCurrency: (amount: number) => string;
//# sourceMappingURL=auth.utils.d.ts.map