
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MyHealthPage } from '@/components/patient/my-health-page';

export default function MyHealthWrapper() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-slate-50/50 pb-20 md:pb-0">
                <div className="container mx-auto py-12">
                   <MyHealthPage />
                </div>
            </main>
            <Footer />
        </div>
    );
}
