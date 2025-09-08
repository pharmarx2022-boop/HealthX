
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { MyReports } from '@/components/patient/my-reports';

export default function ReportsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-slate-50/50">
                <div className="container mx-auto py-8 md:py-12">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><FileText/> My Reports</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MyReports />
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
