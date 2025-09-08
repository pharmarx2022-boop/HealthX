
import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/layout/theme-provider';
import './globals.css';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontSerif = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
})


export const metadata: Metadata = {
  title: 'HealthX',
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
