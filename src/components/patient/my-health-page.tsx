
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { NearbySearch } from '../booking/nearby-search';

export function MyHealthPage() {
    return (
        <div className="space-y-8">
            <div className="mb-4">
                <h1 className="text-3xl font-headline font-bold">My Health Dashboard</h1>
                <p className="text-muted-foreground">Book and manage your appointments.</p>
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
    );
}
