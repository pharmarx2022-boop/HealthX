
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Beaker, Pill, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getRemindersForPatient, deleteReminder, type HealthReminder } from '@/lib/reminders';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function RemindersPage() {
    const { toast } = useToast();
    const [user, setUser] = useState<any | null>(null);
    const [myReminders, setMyReminders] = useState<HealthReminder[]>([]);

    const fetchData = (userId: string) => {
        setMyReminders(getRemindersForPatient(userId));
    }

    useEffect(() => {
        if(typeof window !== 'undefined') {
            const storedUser = sessionStorage.getItem('user');
            if (storedUser) {
                const u = JSON.parse(storedUser);
                setUser(u);
                fetchData(u.id);
            }
        }
    }, []);

    const handleDeleteReminder = (reminderId: string) => {
        if(!user) return;
        deleteReminder(reminderId, user.id);
        fetchData(user.id);
        toast({ title: "Reminder removed", variant: "destructive" });
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-slate-50/50">
                <div className="container mx-auto py-8 md:py-12">
                    <Card>
                         <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Bell/> Your Health Reminders</CardTitle>
                            <CardDescription>Monthly reminders for tests and medicine refills set by your partners.</CardDescription>
                         </CardHeader>
                         <CardContent className="space-y-4">
                            {myReminders.length > 0 ? myReminders.map(reminder => (
                                <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50/70">
                                    <div className="flex items-center gap-3">
                                        {reminder.partnerType === 'lab' ? <Beaker className="w-5 h-5 text-primary" /> : <Pill className="w-5 h-5 text-primary" />}
                                        <div>
                                            <p className="font-medium">{reminder.details}</p>
                                            <p className="text-sm text-muted-foreground">Reminder from {reminder.partnerName}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteReminder(reminder.id)}>
                                        <Trash2 className="w-4 h-4 text-destructive"/>
                                    </Button>
                                </div>
                            )) : (
                                <p className="text-muted-foreground text-center py-8">You have no active reminders.</p>
                            )}
                         </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
