
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NearbySearch } from '@/components/booking/nearby-search';
import { BottomNavBar } from '@/components/layout/bottom-nav-bar';

export default function HealthCoordinatorBookingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-slate-50/50 pb-20 md:pb-0">
                <div className="container mx-auto py-12">
                     <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Book an Appointment</CardTitle>
                            <CardDescription>
                                Find doctors, labs, and pharmacies for your patients.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <NearbySearch />
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
            <BottomNavBar />
        </div>
    );
}
