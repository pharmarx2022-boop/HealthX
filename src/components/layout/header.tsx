
'use client';

import Link from 'next/link';
import { HeartPulse, Calendar, Menu, X, UserCircle, LogOut, Settings, Briefcase, Users, Pill, Beaker, Shield, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from '../ui/separator';


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
      const roleDisplayName = (user.role.charAt(0).toUpperCase() + user.role.slice(1)).replace('-coordinator', ' Coordinator');
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <UserCircle className="mr-2" />
              {roleDisplayName} Account
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/${user.role === 'admin' ? 'admin' : user.role + '/dashboard'}`}>
                <UserCircle className="mr-2" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
             {user.role === 'doctor' && (
                <>
                    <DropdownMenuItem asChild>
                        <Link href="/doctor/dashboard#profile">
                            <Settings className="mr-2" />
                            <span>Manage Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/doctor/clinics">
                            <Briefcase className="mr-2" />
                            <span>Manage Clinics</span>
                        </Link>
                    </DropdownMenuItem>
                </>
             )}
             {user.role === 'patient' && (
                <DropdownMenuItem asChild>
                    <Link href="/patient/dashboard">
                        <Users className="mr-2" />
                        <span>Family Members</span>
                    </Link>
                </DropdownMenuItem>
             )}
             {user.role === 'health-coordinator' && (
                <DropdownMenuItem asChild>
                    <Link href="/health-coordinator/profile">
                        <Gift className="mr-2" />
                        <span>Referral Code</span>
                    </Link>
                </DropdownMenuItem>
             )}
             {user.role === 'pharmacy' && (
                <DropdownMenuItem asChild>
                    <Link href="/pharmacy/dashboard#profile">
                        <Pill className="mr-2" />
                        <span>Manage Profile</span>
                    </Link>
                </DropdownMenuItem>
             )}
              {user.role === 'lab' && (
                <DropdownMenuItem asChild>
                    <Link href="/lab/dashboard#profile">
                        <Beaker className="mr-2" />
                        <span>Manage Profile</span>
                    </Link>
                </DropdownMenuItem>
             )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <Button asChild variant="outline">
        <Link href="/login?role=patient">Login / Register</Link>
      </Button>
    );
  };
  
    const renderMobileAuthButtons = () => {
    if (user) {
      return (
        <>
          <Button variant="ghost" asChild className="justify-start text-lg">
            <Link href={`/${user.role === 'admin' ? 'admin' : user.role + '/dashboard'}`} onClick={() => setIsSheetOpen(false)}>
              <UserCircle className="mr-2" />
              Dashboard
            </Link>
          </Button>
           {user.role === 'doctor' && (
             <>
                <Button variant="ghost" asChild className="justify-start text-lg">
                    <Link href="/doctor/dashboard#profile" onClick={() => setIsSheetOpen(false)}>
                        <Settings className="mr-2" />
                        Manage Profile
                    </Link>
                </Button>
                 <Button variant="ghost" asChild className="justify-start text-lg">
                    <Link href="/doctor/clinics" onClick={() => setIsSheetOpen(false)}>
                        <Briefcase className="mr-2" />
                        Manage Clinics
                    </Link>
                </Button>
            </>
           )}
           {user.role === 'patient' && (
                <Button variant="ghost" asChild className="justify-start text-lg">
                    <Link href="/patient/dashboard" onClick={() => setIsSheetOpen(false)}>
                        <Users className="mr-2" />
                        Family Members
                    </Link>
                </Button>
           )}
           {user.role === 'health-coordinator' && (
              <Button variant="ghost" asChild className="justify-start text-lg">
                  <Link href="/health-coordinator/profile" onClick={() => setIsSheetOpen(false)}>
                      <Gift className="mr-2" />
                      Referral Code
                  </Link>
              </Button>
            )}
           {user.role === 'pharmacy' && (
                <Button variant="ghost" asChild className="justify-start text-lg">
                    <Link href="/pharmacy/dashboard#profile" onClick={() => setIsSheetOpen(false)}>
                        <Pill className="mr-2" />
                        Manage Profile
                    </Link>
                </Button>
           )}
           {user.role === 'lab' && (
                <Button variant="ghost" asChild className="justify-start text-lg">
                    <Link href="/lab/dashboard#profile" onClick={() => setIsSheetOpen(false)}>
                        <Beaker className="mr-2" />
                        Manage Profile
                    </Link>
                </Button>
           )}
          <Button variant="ghost" className="justify-start text-lg" onClick={handleLogout}>
            <LogOut className="mr-2" />
            Logout
          </Button>
        </>
      );
    }
    return (
      <Button asChild className="text-lg">
        <Link href="/login?role=patient" onClick={() => setIsSheetOpen(false)}>Login / Register</Link>
      </Button>
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
          <Button asChild>
            <Link href="/book-appointment"><Calendar className="mr-2"/>Book Appointment</Link>
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
                  <Button asChild className="justify-start text-lg">
                    <Link href="/book-appointment" onClick={() => setIsSheetOpen(false)}>
                      <Calendar className="mr-2"/>Book Appointment
                    </Link>
                  </Button>
                  <Separator className="my-2"/>
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

    