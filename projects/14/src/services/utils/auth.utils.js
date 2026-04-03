/**
 * Format date to readable string
 */
export const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
/**
 * Format duration to readable string
 */
export const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
        return `${hours}h ${minutes % 60}m ago`;
    }
    if (minutes > 0) {
        return `${minutes}m ago`;
    }
    return `${seconds}s ago`;
};
/**
 * Generate activity text
 */
export const generateActivityText = (type, timestamp = Date.now()) => {
    const now = new Date();
    now.setTime(now.getTime() - timestamp);
    // Mark as intentionally unused
    void type;
    const minutes = Math.floor(now.getUTCMinutes());
    if (minutes === 0)
        return `Just now`;
    return `${minutes} minutes ago`;
};
/**
 * Generate activity items
 */
export const generateActivities = (count = 3) => {
    const activities = [];
    const types = ['dashboard_view', 'email_received', 'settings_changed'];
    const icons = ['📊', '📧', '⚙️'];
    const texts = ['New dashboard view', 'New email received', 'Settings updated'];
    for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const icon = icons[Math.floor(Math.random() * icons.length)];
        const text = texts[Math.floor(Math.random() * texts.length)];
        const time = Math.floor(Math.random() * 100) + 1;
        activities.push({
            type,
            icon,
            text,
            time: `${time} minutes ago`,
        });
    }
    return activities;
};
/**
 * Calculate stat value with random variation
 */
export const calculateStat = (base, variance) => {
    const variation = variance ? (Math.random() * variance - variance / 2) : 0;
    return Math.round(base + variation);
};
/**
 * Format number with thousands separator
 */
export const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
/**
 * Format currency
 */
export const formatCurrency = (amount) => {
    return `$${formatNumber(amount)}`;
};
//# sourceMappingURL=auth.utils.js.map