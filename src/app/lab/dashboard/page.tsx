
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaskConical } from 'lucide-react';

export default function LabDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">Lab Dashboard</h1>
                <p className="text-muted-foreground">Manage your lab's services and offers.</p>
            </div>
            
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center gap-4">
                    <FlaskConical className="w-8 h-8 text-primary"/>
                    <div>
                        <CardTitle>Welcome, Lab Partner!</CardTitle>
                        <CardDescription>
                            List your diagnostic services and manage patient requests.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>Lab-specific content and tools will be displayed here.</p>
                </CardContent>
            </Card>

        </div>
      </main>
      <Footer />
    </div>
  );
}
