
'use client';

import Link from 'next/link';
import { HeartPulse, Calendar, Menu, X, UserCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user');
    }
    setUser(null);
    router.push('/');
    setIsSheetOpen(false);
  };

  const renderAuthButtons = () => {
    if (user) {
      return (
        <>
          <Button variant="ghost" asChild>
            <Link href={`/${user.role}/dashboard`}>
              <UserCircle className="mr-2" />
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
            </Link>
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="mr-2" />
            Logout
          </Button>
        </>
      );
    }
    return (
      <>
        <Button variant="ghost" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/register/patient">Sign Up</Link>
        </Button>
      </>
    );
  };
  
    const renderMobileAuthButtons = () => {
    if (user) {
      return (
        <>
          <Button variant="ghost" asChild className="justify-start text-lg">
            <Link href={`/${user.role}/dashboard`} onClick={() => setIsSheetOpen(false)}>
              <UserCircle className="mr-2" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start text-lg" onClick={handleLogout}>
            <LogOut className="mr-2" />
            Logout
          </Button>
        </>
      );
    }
    return (
      <>
        <Button variant="ghost" asChild className="justify-start text-lg">
          <Link href="/login" onClick={() => setIsSheetOpen(false)}>Login</Link>
        </Button>
        <Button asChild className="text-lg">
          <Link href="/register/patient" onClick={() => setIsSheetOpen(false)}>Sign Up</Link>
        </Button>
      </>
    );
  };

  return (
    <header className="py-4 px-6 md:px-12 bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <HeartPulse className="w-8 h-8 text-primary" />
          <span className="text-xl font-headline font-bold text-primary">
            HealthLink Hub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/book-appointment"><Calendar />Book Appointment</Link>
          </Button>
          <div className="h-6 border-l mx-2"></div>
          {renderAuthButtons()}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsSheetOpen(false)}>
                        <HeartPulse className="w-8 h-8 text-primary" />
                        <span className="text-lg font-bold text-primary">
                            HealthLink Hub
                        </span>
                    </Link>
                    <SheetClose asChild>
                        <Button variant="ghost" size="icon">
                            <X className="h-6 w-6" />
                            <span className="sr-only">Close menu</span>
                        </Button>
                    </SheetClose>
                </div>
                <nav className="flex flex-col gap-4">
                  <Button variant="ghost" asChild className="justify-start text-lg">
                    <Link href="/book-appointment" onClick={() => setIsSheetOpen(false)}>
                      <Calendar className="mr-2"/>Book Appointment
                    </Link>
                  </Button>
                  {renderMobileAuthButtons()}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
