
'use client';

import { addNotification } from "./notifications";

export type HealthReminder = {
    id: string;
    partnerId: string;
    partnerName: string;
    partnerType: 'pharmacy' | 'lab';
    patientId: string;
    patientName: string;
    details: string;
    dateSet: string;
    nextReminderDate: string;
};

const REMINDERS_KEY = 'healthReminders';

function getAllReminders(): HealthReminder[] {
    if (typeof window === 'undefined') return [];
    const stored = sessionStorage.getItem(REMINDERS_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveAllReminders(reminders: HealthReminder[]) {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
}

export function getRemindersForPartner(partnerId: string): HealthReminder[] {
    const allReminders = getAllReminders();
    return allReminders.filter(r => r.partnerId === partnerId);
}

export function getRemindersForPatient(patientId: string): HealthReminder[] {
    const allReminders = getAllReminders();
    return allReminders.filter(r => r.patientId === patientId);
}

export function addReminder(data: Omit<HealthReminder, 'id' | 'dateSet' | 'nextReminderDate'>) {
    const allReminders = getAllReminders();
    
    // Calculate next reminder date (e.g., 30 days from now)
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 30);

    const newReminder: HealthReminder = {
        ...data,
        id: `rem_${Date.now()}`,
        dateSet: new Date().toISOString(),
        nextReminderDate: nextDate.toISOString(),
    };

    allReminders.push(newReminder);
    saveAllReminders(allReminders);
}

export function deleteReminder(reminderId: string) {
    let allReminders = getAllReminders();
    const reminder = allReminders.find(r => r.id === reminderId);
    
    if (reminder) {
        addNotification(reminder.partnerId, {
            title: 'Patient Canceled Reminder',
            message: `${reminder.patientName} has disabled the monthly reminder for "${reminder.details}".`,
            icon: 'bell'
        });
    }

    allReminders = allReminders.filter(r => r.id !== reminderId);
    saveAllReminders(allReminders);
}

// In a real app with a backend, a cron job would run daily to check for reminders.
// We can simulate this check when a user loads their dashboard.
export function checkForDueReminders(userId: string) {
    const allReminders = getAllReminders();
    const today = new Date();

    allReminders.forEach(reminder => {
        const reminderDate = new Date(reminder.nextReminderDate);
        if (reminderDate <= today && (reminder.patientId === userId || reminder.partnerId === userId)) {
            // Send notifications
            addNotification(reminder.patientId, {
                title: 'Time for your health check!',
                message: `It's time for your reminder: ${reminder.details} from ${reminder.partnerName}.`,
                icon: 'bell'
            });
            addNotification(reminder.partnerId, {
                title: 'Patient Reminder Sent',
                message: `A monthly reminder for ${reminder.details} was sent to ${reminder.patientName}.`,
                icon: 'bell'
            });

            // Update to next month
            const nextDate = new Date(reminder.nextReminderDate);
            nextDate.setDate(nextDate.getDate() + 30);
            reminder.nextReminderDate = nextDate.toISOString();
        }
    });

    saveAllReminders(allReminders);
}
