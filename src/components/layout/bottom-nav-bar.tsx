
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, LayoutDashboard, User, Settings, Briefcase, Pill, Beaker, Bot, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = {
    href: string;
    icon: React.ElementType;
    label: string;
};

export function BottomNavBar() {
  const [user, setUser] = useState<any | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  if (!user || user.role === 'admin' || user.role === 'patient') {
    return null; // Don't show for admin or patient roles
  }

  let navItems: NavItem[] = [];

  switch (user.role) {
    case 'doctor':
        navItems = [
            { href: '/doctor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { href: '/doctor/clinics', icon: Briefcase, label: 'Clinics' },
            { href: '/doctor/profile', icon: Settings, label: 'Profile' },
        ];
        break;
    case 'health-coordinator':
        navItems = [
            { href: '/health-coordinator/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { href: '/health-coordinator/booking', icon: Calendar, label: 'Book' },
            { href: '/health-coordinator/tools', icon: Bot, label: 'AI Tools' },
        ];
        break;
     case 'lab':
        navItems = [
            { href: '/lab/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { href: '/lab/tools', icon: Beaker, label: 'Tools' },
            { href: '/lab/profile', icon: Settings, label: 'Profile' },
        ];
        break;
     case 'pharmacy':
        navItems = [
            { href: '/pharmacy/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { href: '/pharmacy/tools', icon: Pill, label: 'Tools' },
            { href: '/pharmacy/profile', icon: Settings, label: 'Profile' },
        ];
        break;
    default:
        navItems = [
            { href: `/${user.role}/dashboard`, icon: LayoutDashboard, label: 'Dashboard' },
            { href: `/${user.role}/profile`, icon: Settings, label: 'Profile' },
        ];
  }


  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t md:hidden">
      <div className="grid h-full grid-cols-4 font-medium">
        <button
          onClick={() => router.back()}
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5 mb-1 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Back</span>
        </button>
        {navItems.map(item => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'inline-flex flex-col items-center justify-center px-5 hover:bg-muted',
              pathname === item.href ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </footer>
  );
}
