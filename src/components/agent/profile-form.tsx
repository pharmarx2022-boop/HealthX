
'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';


export function AgentProfileForm() {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(user.referralCode);
    toast({
        title: "Copied to Clipboard!",
        description: "Your referral code has been copied."
    })
  }

  return (
    <div className="space-y-6">
        <div>
            <Label htmlFor="referralCode">Your Referral Code</Label>
            <div className="flex items-center gap-2 mt-2">
                <Input id="referralCode" value={user?.referralCode || ''} readOnly />
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
        </div>
         <p className="text-sm text-muted-foreground">
            Share this code with new Doctors, Pharmacies, Labs, or other Agents you onboard. You'll earn a commission once they meet their activity milestones.
        </p>
    </div>
  );
}
