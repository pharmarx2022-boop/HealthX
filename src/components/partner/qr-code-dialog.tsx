
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { QrCode } from 'lucide-react';
import Image from 'next/image';
import { mockLabs, mockPharmacies } from '@/lib/mock-data';


interface QrCodeDialogProps {
    partnerType: 'pharmacy' | 'lab';
}

export function QrCodeDialog({ partnerType }: QrCodeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // For this demo, we'll use the first partner from the mock data
  const partnerData = partnerType === 'pharmacy' ? mockPharmacies[0] : mockLabs[0];

  // We'll generate a QR code for a simple JSON payload.
  // In a real app, this would contain a unique ID for the partner.
  const qrData = encodeURIComponent(JSON.stringify({ partnerId: partnerData.id, name: partnerData.name }));
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button variant="outline" className="h-full flex-col gap-2">
                <QrCode className="w-8 h-8"/>
                <span>Display QR Code</span>
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Scan to Pay with Health Points</DialogTitle>
                <DialogDescription>
                    Ask the patient to scan this QR code from their HealthLink Hub app to proceed with payment.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 flex flex-col items-center justify-center gap-4">
                <div className="p-4 bg-white rounded-lg border">
                    <Image
                        src={qrCodeUrl}
                        alt={`QR Code for ${partnerData.name}`}
                        width={250}
                        height={250}
                    />
                </div>
                <p className="font-bold text-lg">{partnerData.name}</p>
            </div>
        </DialogContent>
    </Dialog>
  );
}
