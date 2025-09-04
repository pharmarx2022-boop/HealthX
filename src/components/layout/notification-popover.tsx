
'use client';

import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { BellDot, Bell } from 'lucide-react';
import { getNotifications, markNotificationsAsRead, type Notification } from '@/lib/notifications';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';

interface NotificationPopoverProps {
    userId: string;
}

export function NotificationPopover({ userId }: NotificationPopoverProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [hasUnread, setHasUnread] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = () => {
        const userNotifications = getNotifications(userId);
        setNotifications(userNotifications);
        setHasUnread(userNotifications.some(n => !n.read));
    };

    useEffect(() => {
        fetchNotifications();
        
        const handleUpdate = () => fetchNotifications();
        window.addEventListener('notifications-updated', handleUpdate);
        
        return () => {
            window.removeEventListener('notifications-updated', handleUpdate);
        };
    }, [userId]);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open && hasUnread) {
            setTimeout(() => {
                markNotificationsAsRead(userId);
                fetchNotifications(); // Refresh state after marking as read
            }, 1000); // Delay to allow user to see the change
        }
    };


    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    {hasUnread ? (
                        <>
                            <BellDot className="h-6 w-6 text-primary animate-in fade-in-0" />
                            <span className="absolute top-1 right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                        </>
                    ) : (
                        <Bell className="h-6 w-6" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
                <div className="p-4 font-medium border-b">
                    Notifications
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length > 0 ? (
                        <div className="divide-y">
                            {notifications.map(n => (
                                <div key={n.id} className="p-4 hover:bg-slate-50">
                                    <p className={`text-sm ${!n.read ? 'font-semibold' : ''}`}>{n.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatDistanceToNow(new Date(n.date), { addSuffix: true })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center text-muted-foreground p-8">
                            You have no new notifications.
                        </div>
                    )}
                </ScrollArea>
                 <div className="p-2 text-center text-xs text-muted-foreground border-t">
                    End of notifications
                </div>
            </PopoverContent>
        </Popover>
    );
}
