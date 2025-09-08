
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { BottomNavBar } from '@/components/layout/bottom-nav-bar';

const ClinicManager = dynamic(() => import('@/components/doctor/clinic-manager').then(mod => mod.ClinicManager), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin" /></div>,
});


export default function DoctorClinicsPage() {
    const [user, setUser] = useState<any>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50 pb-20 md:pb-0">
        <div className="container mx-auto py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">Manage Your Clinics</h1>
                <p className="text-muted-foreground">Add, edit, and manage your clinic locations and schedules.</p>
            </div>
            
            {isClient && user?.status === 'pending' && (
                <Alert variant="default" className="mb-8 bg-yellow-50 border-yellow-200 text-yellow-800">
                    <ShieldCheck className="h-4 w-4 !text-yellow-800" />
                    <AlertTitle>Account Pending Approval</AlertTitle>
                    <AlertDescription>
                        Your account is currently under review by the admin. You can set up your clinics now, but they will not be visible to patients until your account is approved.
                    </AlertDescription>
                </Alert>
            )}

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Your Clinics</CardTitle>
                    <CardDescription>
                        Here you can manage all your practice locations and their availability.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ClinicManager />
                </CardContent>
            </Card>

        </div>
      </main>
      <Footer />
       <BottomNavBar />
    </div>
  );
}
