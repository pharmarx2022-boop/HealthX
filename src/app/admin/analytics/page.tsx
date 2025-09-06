
import { AnalyticsDashboard } from '@/components/admin/analytics-dashboard';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8">
        <div className="mb-8">
            <h1 className="text-3xl font-headline font-bold">Platform Analytics</h1>
            <p className="text-muted-foreground">An overview of your platform's performance and growth.</p>
        </div>
        
        <AnalyticsDashboard />
    </div>
  );
}
