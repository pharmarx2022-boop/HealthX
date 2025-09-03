
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

export default function AgentDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">Agent Dashboard</h1>
                <p className="text-muted-foreground">Book appointments and manage your commissions.</p>
            </div>
            
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Briefcase className="w-8 h-8 text-primary"/>
                    <div>
                        <CardTitle>Welcome, Agent!</CardTitle>
                        <CardDescription>
                            This is your portal to manage patient appointments and track your earnings.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>Agent-specific content and tools will be displayed here.</p>
                </CardContent>
            </Card>

        </div>
      </main>
      <Footer />
    </div>
  );
}
