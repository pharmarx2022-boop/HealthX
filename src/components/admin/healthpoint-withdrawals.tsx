

'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

export function HealthPointWithdrawals() {
    const { toast } = useToast();

    // This component is now deprecated as earnings are consolidated into the commission wallet.
    // It has been removed from the UI and can be safely deleted.

    return (
        <div className="hidden">
            {/* This component is deprecated and no longer shown in the UI. */}
        </div>
    );
}
