
'use client';

import { MOCK_OTP } from './auth';

export type Notification = {
    id: string;
    userId: string;
    message: string;
    date: string;
    read: boolean;
};

const getNotificationsKey = (userId: string) => `notifications_${userId}`;

export function getNotifications(userId: string): Notification[] {
    if (typeof window === 'undefined') return [];
    const key = getNotificationsKey(userId);
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
}

function saveNotifications(userId: string, notifications: Notification[]) {
    if (typeof window === 'undefined') return;
    const key = getNotificationsKey(userId);
    sessionStorage.setItem(key, JSON.stringify(notifications));
}

export function addNotification(userId: string, message: string) {
    const notifications = getNotifications(userId);
    const newNotification: Notification = {
        id: `notif_${Date.now()}`,
        userId,
        message,
        date: new Date().toISOString(),
        read: false,
    };
    saveNotifications(userId, [newNotification, ...notifications]);
    // Dispatch a custom event to notify components like the header
    window.dispatchEvent(new CustomEvent('notifications-updated'));
}

export function markNotificationsAsRead(userId: string) {
    const notifications = getNotifications(userId).map(n => ({...n, read: true}));
    saveNotifications(userId, notifications);
    window.dispatchEvent(new CustomEvent('notifications-updated'));
}

// --- OTP Related Notifications ---

export function sendLoginOtpNotification(email: string) {
    // In a real app, you'd look up the user by email first.
    // For this demo, we'll assume a user exists for any valid-looking email.
     const message = `Your login OTP is ${MOCK_OTP}. It's valid for 10 minutes.`;
     console.log(`Pretending to send notification to user with email ${email}: ${message}`);
     // Here we can't directly add a notification because we don't have the user ID.
     // The login page will add it after successful login.
}


export function sendRedemptionOtpNotification(patientId: string, patientName: string) {
    const message = `An OTP was requested to redeem your Health Points. Your OTP is ${MOCK_OTP}.`;
    addNotification(patientId, message);
}

export function sendBookingOtpNotification(patientId: string, patientName: string) {
    const message = `An OTP was requested to book an appointment. Your OTP is ${MOCK_OTP}.`;
    addNotification(patientId, message);
}
