

'use client';

export type Notification = {
    id: string;
    userId: string;
    title: string;
    icon: 'calendar' | 'wallet' | 'gift' | 'bell' | 'file-text' | 'login';
    href?: string;
    message: string;
    date: string;
    read: boolean;
};

// In a production app, notifications would be fetched from a backend service (e.g., via WebSockets or API calls)
// and likely stored in a database, not localStorage.

const getNotificationsKey = (userId: string) => `notifications_${userId}`;

export function getNotifications(userId: string): Notification[] {
    if (typeof window === 'undefined') return [];
    // Switched to localStorage for persistence across sessions, but this is still client-side.
    const key = getNotificationsKey(userId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
}

function saveNotifications(userId: string, notifications: Notification[]) {
    if (typeof window === 'undefined') return;
    const key = getNotificationsKey(userId);
    localStorage.setItem(key, JSON.stringify(notifications));
    window.dispatchEvent(new CustomEvent('notifications-updated'));
}

export function addNotification(userId: string, data: Omit<Notification, 'id' | 'userId' | 'date' | 'read'>) {
    const notifications = getNotifications(userId);
    const newNotification: Notification = {
        ...data,
        id: `notif_${Date.now()}`,
        userId,
        date: new Date().toISOString(),
        read: false,
    };
    saveNotifications(userId, [newNotification, ...notifications]);
}

export function markNotificationsAsRead(userId: string) {
    const notifications = getNotifications(userId).map(n => ({...n, read: true}));
    saveNotifications(userId, notifications);
}


// --- OTP Related Notifications ---
// In production, these would be sent via a secure backend service (e.g., SMS, Email, Push Notification).

export function sendRedemptionOtpNotification(patientId: string, patientName: string) {
    addNotification(patientId, {
        title: 'Your OTP is here!',
        message: `Use OTP 123456 to confirm your payment.`,
        icon: 'wallet',
    });
}

export function sendBookingOtpNotification(patientId: string, patientName: string) {
     addNotification(patientId, {
        title: 'Confirm Your Booking',
        message: `Your OTP to confirm the appointment is 123456.`,
        icon: 'calendar',
    });
}
