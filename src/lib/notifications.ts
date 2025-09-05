

'use client';

export type Notification = {
    id: string;
    userId: string;
    // New fields for a richer experience
    title: string;
    icon: 'calendar' | 'wallet' | 'gift' | 'bell' | 'file-text' | 'login';
    href?: string;
    // Main content
    message: string;
    date: string;
    read: boolean;
};

const getNotificationsKey = (userId: string) => `notifications_${userId}`;

export function getNotifications(userId: string): Notification[] {
    if (typeof window === 'undefined') return [];
    // Switched to localStorage for persistence across sessions
    const key = getNotificationsKey(userId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
}

function saveNotifications(userId: string, notifications: Notification[]) {
    if (typeof window === 'undefined') return;
    const key = getNotificationsKey(userId);
    localStorage.setItem(key, JSON.stringify(notifications));
    // Dispatch a custom event to notify components like the header
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
