
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Loader2, User } from 'lucide-react';
import { PatientList } from '@/components/doctor/patient-list';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { AnalyticsDashboard } from '@/components/doctor/analytics-dashboard';
import { BottomNavBar } from '@/components/layout/bottom-nav-bar';

export default function DoctorDashboardPage() {
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = sessionStorage.getItem('user');
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
                <h1 className="text-3xl font-headline font-bold">Doctor Dashboard</h1>
                <p className="text-muted-foreground">Welcome, {user?.name || 'Doctor'}! Manage your appointments and patient interactions.</p>
            </div>

            <AnalyticsDashboard />

            <div className="grid lg:grid-cols-3 gap-8 mt-8 items-start">
                <div className="lg:col-span-3 space-y-8">
                     <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Stethoscope className="w-8 h-8 text-primary"/>
                            <div>
                                <CardTitle>Patient Appointments</CardTitle>
                                <CardDescription>
                                   View, manage, and filter your patient list.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <PatientList />
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
      </main>
      <Footer />
      <BottomNavBar />
    </div>
  );
}
