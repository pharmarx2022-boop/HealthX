
'use client';

import { AnalyticsDashboard } from '@/components/admin/analytics-dashboard';
import { useState } from 'react';

export default function AdminAnalyticsPage() {
  const [isPro, setIsPro] = useState(false);
  
  if (!isPro) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-2xl font-bold mb-2">Unlock Full Analytics</h2>
        <p className="text-muted-foreground mb-4 max-w-md">
          Our PRO plan offers detailed insights, user growth charts, and revenue breakdowns. 
          This feature is not available in the free version.
        </p>
      </div>
    );
  }

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
