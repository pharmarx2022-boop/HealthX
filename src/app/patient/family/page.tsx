
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { FamilyManager } from '@/components/patient/family-manager';

export default function FamilyPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-slate-50/50">
                <div className="container mx-auto py-8 md:py-12">
                     <Card>
                         <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Users/> Family Members</CardTitle>
                            <CardDescription>Manage family members to book appointments on their behalf.</CardDescription>
                         </CardHeader>
                         <CardContent>
                            <FamilyManager />
                         </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
