
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { RefundTool } from '@/components/admin/refund-tool';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage users, approvals, and refunds.</p>
            </div>
            
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>AI-Assisted Refund Tool</CardTitle>
                    <CardDescription>
                        Use this tool to quickly verify user refund requests by looking up consultation history and wallet balance.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RefundTool />
                </CardContent>
            </Card>

        </div>
      </main>
      <Footer />
    </div>
  );
}
