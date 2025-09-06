
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getSubmissions, type ContactSubmission } from '@/lib/contact-submissions';
import { Loader2, Mail, User } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function InquiriesPage() {
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            setIsLoading(true);
            const data = await getSubmissions();
            setSubmissions(data);
            setIsLoading(false);
        };
        fetchSubmissions();
    }, []);


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-headline font-bold">Contact Form Inquiries</h1>
                <p className="text-muted-foreground">View messages submitted by users through the public contact form.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Received Messages</CardTitle>
                    <CardDescription>A list of all inquiries from the contact page.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                         <div className="flex items-center justify-center p-8">
                            <Loader2 className="animate-spin" />
                            <p className="ml-2">Loading inquiries...</p>
                        </div>
                    ) : submissions.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                            {submissions.map((sub) => (
                                <AccordionItem key={sub.id} value={sub.id}>
                                    <AccordionTrigger>
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full pr-4 text-left">
                                            <div className="flex-grow">
                                                <p className="font-semibold">{sub.subject}</p>
                                                <p className="text-sm text-muted-foreground">{sub.name} - {sub.email}</p>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2 sm:mt-0">{format(new Date(sub.date), 'PP, p')}</p>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="p-4 bg-slate-50 border rounded-md">
                                            <p className="whitespace-pre-wrap">{sub.message}</p>
                                            <div className="mt-4 pt-4 border-t">
                                                <Button asChild>
                                                    <a href={`mailto:${sub.email}?subject=Re: ${sub.subject}`}>
                                                        <Mail className="mr-2 h-4 w-4" /> Reply to {sub.email}
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">No inquiries have been submitted yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
