import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getOpeningStatus(days: string[], hours: string): { isOpen: boolean; text: string } {
    if (!days || !hours || days.length === 0) {
        return { isOpen: false, text: "Hours not listed" };
    }

    try {
        const now = new Date();
        const currentDay = now.toLocaleString('en-US', { weekday: 'long' });

        if (!days.includes(currentDay)) {
            return { isOpen: false, text: "Closed" };
        }

        const parts = hours.split('-').map(s => s.trim());
        if (parts.length !== 2) {
             return { isOpen: false, text: "Hours not listed" };
        }

        const [startTimeStr, endTimeStr] = parts;

        const parseTime = (timeStr: string) => {
            const [time, modifier] = timeStr.split(' ');
            let [h, m] = time.split(':').map(Number);

            if (modifier && modifier.toUpperCase() === 'PM' && h !== 12) {
                h += 12;
            }
            if (modifier && modifier.toUpperCase() === 'AM' && h === 12) {
                h = 0;
            }
            return { h, m };
        };
        
        if (hours.toLowerCase() === '24 hours') {
            return { isOpen: true, text: "Open 24 Hours" };
        }

        const startTime = parseTime(startTimeStr);
        const endTime = parseTime(endTimeStr);

        const startMinutes = startTime.h * 60 + (startTime.m || 0);
        let endMinutes = endTime.h * 60 + (endTime.m || 0);
        
        // Handle overnight hours
        if (endMinutes < startMinutes) {
            endMinutes += 24 * 60;
        }
        
        let currentMinutes = now.getHours() * 60 + now.getMinutes();
        
        // Adjust current time if checking against overnight hours from previous day
        if (endMinutes > 24 * 60 && currentMinutes < startMinutes) {
             currentMinutes += 24*60;
        }

        const isOpen = currentMinutes >= startMinutes && currentMinutes < endMinutes;

        return {
            isOpen,
            text: isOpen ? "Open" : "Closed"
        };

    } catch (e) {
        console.error("Error parsing opening hours:", e);
        return { isOpen: false, text: "Hours not listed" };
    }
}
