
import type { Metadata } from 'next';
import { Playfair_Display, PT_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { FloatingWhatsApp } from '@/components/layout/floating-whatsapp';

const fontSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
})

const fontSerif = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-serif',
})


export const metadata: Metadata = {
  title: 'HealthLink Hub',
  description: 'An integrated platform for Doctors, Patients, Pharmacies, Labs, and Agents.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
           fontSans.variable,
           fontSerif.variable
        )}
      >
        {children}
        <Toaster />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
