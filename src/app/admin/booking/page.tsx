
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NearbySearch } from '@/components/booking/nearby-search';
import { BookUser } from 'lucide-react';

export default function AdminBookingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-headline font-bold flex items-center gap-3"><BookUser /> Book for a Patient</h1>
                        <p className="text-muted-foreground">Search for any service and book an appointment on behalf of any patient.</p>
                    </div>
                     <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Find a Service</CardTitle>
                            <CardDescription>
                                Find doctors, labs, and pharmacies for any patient.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <NearbySearch />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
