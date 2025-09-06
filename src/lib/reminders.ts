
'use client';

import { addNotification } from "./notifications";

export type MedicineReminder = {
    id: string;
    pharmacyId: string;
    pharmacyName: string;
    patientId: string;
    patientName: string;
    medicineDetails: string;
    dateSet: string;
    nextReminderDate: string;
};

const REMINDERS_KEY = 'medicineReminders';

function getAllReminders(): MedicineReminder[] {
    if (typeof window === 'undefined') return [];
    const stored = sessionStorage.getItem(REMINDERS_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveAllReminders(reminders: MedicineReminder[]) {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
}

export function getRemindersForPharmacy(pharmacyId: string): MedicineReminder[] {
    const allReminders = getAllReminders();
    return allReminders.filter(r => r.pharmacyId === pharmacyId);
}

export function getRemindersForPatient(patientId: string): MedicineReminder[] {
    const allReminders = getAllReminders();
    return allReminders.filter(r => r.patientId === patientId);
}

export function addReminder(data: Omit<MedicineReminder, 'id' | 'dateSet' | 'nextReminderDate'>) {
    const allReminders = getAllReminders();
    
    // Calculate next reminder date (e.g., 30 days from now)
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 30);

    const newReminder: MedicineReminder = {
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
        addNotification(reminder.pharmacyId, {
            title: 'Patient Canceled Reminder',
            message: `${reminder.patientName} has disabled the monthly reminder for "${reminder.medicineDetails}".`,
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
        if (reminderDate <= today && (reminder.patientId === userId || reminder.pharmacyId === userId)) {
            // Send notifications
            addNotification(reminder.patientId, {
                title: 'Time to Refill!',
                message: `It's time to refill your medicines: ${reminder.medicineDetails} from ${reminder.pharmacyName}.`,
                icon: 'bell'
            });
            addNotification(reminder.pharmacyId, {
                title: 'Patient Reminder Sent',
                message: `A monthly reminder for ${reminder.medicineDetails} was sent to ${reminder.patientName}.`,
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
