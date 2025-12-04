// Utility functions
export const startOfToday = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
};

export const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
};

export const formatTimeIST = (date) => {
    if (!date) return '-';
    // If it's a Firestore Timestamp, convert to Date
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });
};
