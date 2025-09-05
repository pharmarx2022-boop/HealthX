

'use client';

import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { BellDot, Bell, Calendar, Wallet, Gift, FileText, CheckCheck } from 'lucide-react';
import { getNotifications, markNotificationsAsRead, type Notification } from '@/lib/notifications';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface NotificationPopoverProps {
    userId: string;
}

const iconMap = {
    calendar: Calendar,
    wallet: Wallet,
    gift: Gift,
    'file-text': FileText,
    bell: Bell,
    login: Bell, // default
};

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
        // Listen for the custom event to update notifications
        window.addEventListener('notifications-updated', handleUpdate);
        
        return () => {
            window.removeEventListener('notifications-updated', handleUpdate);
        };
    }, [userId]);
    
    const handleMarkAllAsRead = (e: React.MouseEvent) => {
        e.preventDefault();
        markNotificationsAsRead(userId);
        fetchNotifications();
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
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
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-3 font-medium border-b flex justify-between items-center">
                    <span className="text-sm">Notifications</span>
                    {hasUnread && (
                         <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={handleMarkAllAsRead}>
                            <CheckCheck className="mr-1 h-3 w-3" /> Mark all as read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length > 0 ? (
                        <div className="divide-y">
                            {notifications.map(n => {
                                const Icon = iconMap[n.icon] || Bell;
                                const content = (
                                     <div className={cn("p-3 hover:bg-slate-50 flex items-start gap-3", !n.read && "bg-primary/5")}>
                                        <div className={cn("w-8 h-8 flex items-center justify-center rounded-full shrink-0 mt-1", !n.read ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-muted-foreground')}>
                                             <Icon className="w-4 h-4"/>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{n.title}</p>
                                            <p className="text-sm text-muted-foreground">{n.message}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatDistanceToNow(new Date(n.date), { addSuffix: true })}
                                            </p>
                                        </div>
                                         {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1 shrink-0"></div>}
                                    </div>
                                );
                                return n.href ? (
                                    <Link key={n.id} href={n.href} onClick={() => setIsOpen(false)}>{content}</Link>
                                ) : (
                                    <div key={n.id}>{content}</div>
                                );
                            })}
                        </div>
                    ) : (
                         <div className="text-center text-muted-foreground p-8 text-sm">
                            You have no new notifications.
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
