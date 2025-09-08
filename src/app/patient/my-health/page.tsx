
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { NearbySearch } from '@/components/booking/nearby-search';

export default function MyHealthPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-slate-50/50">
                <div className="container mx-auto py-8 md:py-12">
                    <div className="mb-4">
                        <h1 className="text-3xl font-headline font-bold">My Health Dashboard</h1>
                        <p className="text-muted-foreground">Book appointments for yourself or your family members.</p>
                    </div>
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Briefcase className="w-8 h-8 text-primary"/>
                            <div>
                                <CardTitle>Book New Appointment</CardTitle>
                                <CardDescription>
                                    Find doctors, labs, and pharmacies near you.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <NearbySearch allowedServices={['doctor', 'lab', 'pharmacy']} />
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
