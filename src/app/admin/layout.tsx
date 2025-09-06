
'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  BadgePercent,
  Banknote,
  ShieldCheck,
  Loader2,
  Lock,
  LineChart,
  Contact,
  FileText,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { verifyAdmin } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isVerified, setIsVerified] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // This simulates a server-side check. In a real app, this would be
    // handled by server-side rendering or an API call that checks a secure cookie.
    if (verifyAdmin()) {
      setIsVerified(true);
    } else {
      router.replace('/'); // Redirect non-admins to the homepage
    }
    setIsLoading(false);
  }, [router]);

  const menuItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/admin/analytics',
      label: 'Analytics',
      icon: LineChart,
    },
    {
      href: '/admin/users',
      label: 'Users',
      icon: Users,
    },
    {
      href: '/admin/support',
      label: 'Support',
      icon: MessageSquare,
    },
    {
      href: '/admin/approvals',
      label: 'Approvals',
      icon: ShieldCheck,
    },
    {
      href: '/admin/withdrawals',
      label: 'Withdrawals',
      icon: Banknote,
    },
     {
      href: '/admin/team',
      label: 'Team',
      icon: Contact,
    },
    {
      href: '/admin/content',
      label: 'Site Content',
      icon: FileText,
    }
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  if (!isVerified) {
    // You can optionally show a more specific "Access Denied" page here
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Lock className="h-16 w-16 text-destructive" />
        <h1 className="mt-4 text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">
          You do not have permission to view this page.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    );
  }

  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
                 <div className="flex items-center gap-2 p-2">
                    <SidebarTrigger />
                 </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {menuItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <Link href={item.href}>
                                <SidebarMenuButton
                                    isActive={pathname === item.href}
                                    icon={<item.icon />}
                                    tooltip={item.label}
                                >
                                    {item.label}
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                {/* Optional Footer Content */}
            </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <Header/>
            <main className="p-4 md:p-6 lg:p-8">
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
