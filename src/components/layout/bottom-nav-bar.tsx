
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, LayoutDashboard, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNavBar() {
  const [user, setUser] = useState<any | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  if (!user || user.role === 'admin' || user.role === 'patient') {
    return null; // Don't show for admin or patient roles
  }

  const dashboardPath = `/${user.role}/dashboard`;
  const profilePath = `/${user.role}/profile`;

  const navItems = [
    { href: dashboardPath, icon: LayoutDashboard, label: 'Dashboard' },
    { href: profilePath, icon: User, label: 'Profile' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t md:hidden">
      <div className="grid h-full grid-cols-3 font-medium">
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
