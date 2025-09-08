
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
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
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
  HelpCircle,
  ClipboardList,
  Calendar,
  BookUser,
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

  const mainNav = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/analytics', label: 'Analytics', icon: LineChart },
  ];

  const bookingNav = [
     { href: '/admin/appointments', label: 'All Appointments', icon: Calendar },
     { href: '/admin/booking', label: 'Book for Patient', icon: BookUser },
  ];

  const userManagementNav = [
      { href: '/admin/users', label: 'User Management', icon: Users },
      { href: '/admin/approvals', label: 'Partner Approvals', icon: ShieldCheck },
      { href: '/admin/withdrawals', label: 'Withdrawals', icon: Banknote },
  ];

  const supportNav = [
      { href: '/admin/support', label: 'AI Support Assistant', icon: MessageSquare },
      { href: '/admin/inquiries', label: 'Contact Inquiries', icon: HelpCircle },
  ];

  const contentNav = [
      { href: '/admin/content', label: 'Site Content', icon: FileText },
      { href: '/admin/team', label: 'Team Members', icon: Contact },
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
                  {mainNav.map((item) => (
                      <SidebarMenuItem key={item.href}>
                          <Link href={item.href}>
                              <SidebarMenuButton isActive={pathname === item.href} icon={<item.icon />} tooltip={item.label}>
                                  {item.label}
                              </SidebarMenuButton>
                          </Link>
                      </SidebarMenuItem>
                  ))}
                </SidebarMenu>
                <SidebarSeparator />
                 <SidebarGroup>
                    <SidebarGroupLabel>Bookings</SidebarGroupLabel>
                    <SidebarMenu>
                       {bookingNav.map((item) => (
                          <SidebarMenuItem key={item.href}>
                              <Link href={item.href}>
                                  <SidebarMenuButton isActive={pathname === item.href} icon={<item.icon />} tooltip={item.label}>
                                      {item.label}
                                  </SidebarMenuButton>
                              </Link>
                          </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarSeparator />
                 <SidebarGroup>
                    <SidebarGroupLabel>User Management</SidebarGroupLabel>
                    <SidebarMenu>
                       {userManagementNav.map((item) => (
                          <SidebarMenuItem key={item.href}>
                              <Link href={item.href}>
                                  <SidebarMenuButton isActive={pathname === item.href} icon={<item.icon />} tooltip={item.label}>
                                      {item.label}
                                  </SidebarMenuButton>
                              </Link>
                          </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarSeparator />
                 <SidebarGroup>
                    <SidebarGroupLabel>Support</SidebarGroupLabel>
                    <SidebarMenu>
                       {supportNav.map((item) => (
                          <SidebarMenuItem key={item.href}>
                              <Link href={item.href}>
                                  <SidebarMenuButton isActive={pathname === item.href} icon={<item.icon />} tooltip={item.label}>
                                      {item.label}
                                  </SidebarMenuButton>
                              </Link>
                          </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarSeparator />
                 <SidebarGroup>
                    <SidebarGroupLabel>Content</SidebarGroupLabel>
                    <SidebarMenu>
                       {contentNav.map((item) => (
                          <SidebarMenuItem key={item.href}>
                              <Link href={item.href}>
                                  <SidebarMenuButton isActive={pathname === item.href} icon={<item.icon />} tooltip={item.label}>
                                      {item.label}
                                  </SidebarMenuButton>
                              </Link>
                          </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                </SidebarGroup>
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
