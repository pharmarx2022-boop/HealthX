
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, User, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export function BottomNavBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  if (!isClient || !user || user.role === 'admin') {
    return null; // Don't show for admins or if not logged in
  }

  let navItems = [];
  if (user.role === 'patient') {
      navItems = [
        { href: '/patient/my-health', label: 'My Health', icon: LayoutDashboard },
        { href: '/book-appointment', label: 'Book', icon: Calendar },
      ];
  } else if (user.role === 'health-coordinator') {
      navItems = [
        { href: '/book-appointment', label: 'Book', icon: Calendar },
        { href: '/health-coordinator/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ];
  } else if (user.role === 'doctor') {
      navItems = [
        { href: `/${user.role}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
        { href: `/${user.role}/profile`, label: 'Profile', icon: User },
      ]
  } else {
       navItems = [
        { href: '/book-appointment', label: 'Book', icon: Calendar },
        { href: `/${user.role}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
      ];
  }


  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border">
      <div className={`grid h-full max-w-lg grid-cols-${navItems.length} mx-auto font-medium`}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
