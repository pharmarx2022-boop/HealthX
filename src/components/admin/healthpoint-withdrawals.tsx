

'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

export function HealthPointWithdrawals() {
    const { toast } = useToast();

    // This component is now deprecated as earnings are consolidated into the commission wallet.
    // It can be removed or repurposed later if needed.

    return (
        <div className="hidden">
            <p className="text-center text-muted-foreground py-8">
                This withdrawal system is no longer in use. All partner earnings (from referrals and Health Point transactions) are consolidated into the main Commission Withdrawal system. Please manage all withdrawal requests there.
            </p>
        </div>
    );
}
