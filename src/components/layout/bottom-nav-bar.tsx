
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, User, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';

export function BottomNavBar() {
  const pathname = usePathname();
  const router = useRouter();
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
  
  const handleBack = () => {
    router.back();
  };

  const backButton = {
      label: 'Back',
      icon: ArrowLeft,
      onClick: handleBack,
      href: '#back' // Dummy href for key
  };

  let navItems = [
     { href: '/', label: 'Home', icon: Home },
  ];
  
  if (user.role === 'patient') {
      navItems = [
        { href: '/patient/my-health', label: 'My Health', icon: Home },
        { href: '/book-appointment', label: 'Book', icon: Calendar },
        { href: '/patient/profile', label: 'Profile', icon: User }
      ];
  } else if (user.role === 'health-coordinator') {
      navItems = [
        { href: '/health-coordinator/dashboard', label: 'Dashboard', icon: Home },
        { href: '/book-appointment', label: 'Book', icon: Calendar },
        { href: '/health-coordinator/profile', label: 'Profile', icon: User }
      ];
  } else if (user.role === 'doctor') {
      navItems = [
        { href: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/doctor/clinics', label: 'Clinics', icon: Calendar },
        { href: '/doctor/profile', label: 'Profile', icon: User },
      ]
  } else { // Lab and Pharmacy
       const dashboardPath = `/${user.role}/dashboard`;
       navItems = [
        // Ensure "Home" and "Dashboard" are not duplicated if they point to the same URL
        { href: '/', label: 'Home', icon: Home },
      ];
      if (dashboardPath !== '/') {
        navItems.push({ href: dashboardPath, label: 'Dashboard', icon: LayoutDashboard });
      }
       navItems.push(
        { href: '/book-appointment', label: 'Book', icon: Calendar },
        { href: `/${user.role}/profile`, label: 'Profile', icon: User },
      );
  }

  // Add the back button to the beginning of the list
  const finalNavItems = [backButton, ...navItems];

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border">
      <div className={`grid h-full max-w-lg grid-cols-${finalNavItems.length} mx-auto font-medium`}>
        {finalNavItems.map((item) => {
          if (item.onClick) {
            return (
               <button
                  key={item.label}
                  onClick={item.onClick}
                  type="button"
                  className='inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group text-muted-foreground'
                >
                  <item.icon className="w-5 h-5 mb-1" />
                  <span className="text-xs">{item.label}</span>
                </button>
            )
          }

          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href!}
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
