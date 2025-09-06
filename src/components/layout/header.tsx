

'use client';

import Link from 'next/link';
import { HeartPulse, Menu, X, UserCircle, LogOut, Settings, Briefcase, Users, Pill, Beaker, Gift, Bell, Calendar, LayoutDashboard, Info, Mail, ShieldCheck, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationPopover } from './notification-popover';
import { Separator } from '../ui/separator';


export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

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
      sessionStorage.removeItem(`notifications_${user.id}`);
    }
    setUser(null);
    router.push('/');
    setIsSheetOpen(false);
  };
  
  // Hide header on admin pages for a cleaner look, as it has its own layout
  if (pathname?.startsWith('/admin')) {
      return null;
  }

  const renderAuthButtons = () => {
    if (user) {
      const roleDisplayName = (user.role.charAt(0).toUpperCase() + user.role.slice(1)).replace('-coordinator', ' Coordinator');
      const dashboardPath = user.role === 'admin' ? '/admin' 
                           : user.role === 'patient' ? '/patient/my-health'
                           : `/${user.role}/dashboard`;

      return (
        <>
            <NotificationPopover userId={user.id} />
             {(user.role === 'patient' || user.role === 'health-coordinator') && (
                <Button asChild>
                    <Link href="/book-appointment">
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Appointment
                    </Link>
                </Button>
            )}
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
                <Link href={dashboardPath}>
                    <UserCircle className="mr-2" />
                    <span>Dashboard</span>
                </Link>
                </DropdownMenuItem>
                {user.role === 'doctor' && (
                    <>
                        <DropdownMenuItem asChild>
                            <Link href="/doctor/profile">
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
                    <>
                         <DropdownMenuItem asChild>
                            <Link href="/patient/profile">
                                <Settings className="mr-2" />
                                <span>Manage Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/patient/my-health#family">
                                <Users className="mr-2" />
                                <span>Family Members</span>
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}
                {user.role === 'health-coordinator' && (
                    <DropdownMenuItem asChild>
                        <Link href="/health-coordinator/profile">
                            <Settings className="mr-2" />
                            <span>Manage Profile</span>
                        </Link>
                    </DropdownMenuItem>
                )}
                {user.role === 'pharmacy' && (
                    <DropdownMenuItem asChild>
                        <Link href="/pharmacy/profile">
                            <Pill className="mr-2" />
                            <span>Manage Profile</span>
                        </Link>
                    </DropdownMenuItem>
                )}
                {user.role === 'lab' && (
                    <DropdownMenuItem asChild>
                        <Link href="/lab/profile">
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
        </>
      );
    }
    return null;
  };
  
    const renderMobileAuthButtons = () => {
    if (user) {
       const dashboardPath = user.role === 'admin' ? '/admin' 
                           : user.role === 'patient' ? '/patient/my-health'
                           : `/${user.role}/dashboard`;
      return (
        <>
          <Button variant="ghost" asChild className="justify-start text-lg">
            <Link href={dashboardPath} onClick={() => setIsSheetOpen(false)}>
              <UserCircle className="mr-2" />
              Dashboard
            </Link>
          </Button>
           {user.role === 'doctor' && (
             <>
                <Button variant="ghost" asChild className="justify-start text-lg">
                    <Link href="/doctor/profile" onClick={() => setIsSheetOpen(false)}>
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
               <>
                    <Button variant="ghost" asChild className="justify-start text-lg">
                        <Link href="/patient/profile" onClick={() => setIsSheetOpen(false)}>
                            <Settings className="mr-2" />
                            Manage Profile
                        </Link>
                    </Button>
                    <Button variant="ghost" asChild className="justify-start text-lg">
                        <Link href="/patient/my-health#family" onClick={() => setIsSheetOpen(false)}>
                            <Users className="mr-2" />
                            Family Members
                        </Link>
                    </Button>
                </>
           )}
           {user.role === 'health-coordinator' && (
              <Button variant="ghost" asChild className="justify-start text-lg">
                  <Link href="/health-coordinator/profile" onClick={() => setIsSheetOpen(false)}>
                      <Settings className="mr-2" />
                      Manage Profile
                  </Link>
              </Button>
            )}
           {user.role === 'pharmacy' && (
                <Button variant="ghost" asChild className="justify-start text-lg">
                    <Link href="/pharmacy/profile" onClick={() => setIsSheetOpen(false)}>
                        <Pill className="mr-2" />
                        Manage Profile
                    </Link>
                </Button>
           )}
           {user.role === 'lab' && (
                <Button variant="ghost" asChild className="justify-start text-lg">
                    <Link href="/lab/profile" onClick={() => setIsSheetOpen(false)}>
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
    return null;
  };

  return (
    <header className="py-4 px-6 md:px-12 bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <HeartPulse className="w-8 h-8 text-primary" />
          <span className="text-xl font-headline font-bold text-primary">
            HealthX
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {renderAuthButtons()}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          {user && <NotificationPopover userId={user.id} />}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
               <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsSheetOpen(false)}>
                        <HeartPulse className="w-8 h-8 text-primary" />
                        <span className="text-lg font-bold text-primary">
                            HealthX
                        </span>
                    </Link>
                    <SheetClose asChild>
                        <Button variant="ghost" size="icon">
                            <X className="h-6 w-6" />
                            <span className="sr-only">Close menu</span>
                        </Button>
                    </SheetClose>
                </div>
                <nav className="flex flex-col gap-2">
                  {user ? (
                    renderMobileAuthButtons()
                  ) : (
                     <Button variant="default" asChild className="justify-start text-lg h-12">
                        <Link href="#roles" onClick={() => setIsSheetOpen(false)}>
                            <UserCircle className="mr-2" />
                            Login / Sign Up
                        </Link>
                     </Button>
                  )}
                  
                  <Separator className="my-2"/>
                  
                  <Button variant="ghost" asChild className="justify-start text-lg">
                    <Link href="/about" onClick={() => setIsSheetOpen(false)}>
                        <Info className="mr-2" /> About Us
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start text-lg">
                     <Link href="/contact" onClick={() => setIsSheetOpen(false)}>
                        <Mail className="mr-2" /> Contact Us
                    </Link>
                  </Button>
                   <Button variant="ghost" asChild className="justify-start text-lg">
                     <Link href="/terms-of-service" onClick={() => setIsSheetOpen(false)}>
                        <FileText className="mr-2" /> Terms of Service
                    </Link>
                  </Button>
                   <Button variant="ghost" asChild className="justify-start text-lg">
                     <Link href="/privacy-policy" onClick={() => setIsSheetOpen(false)}>
                        <ShieldCheck className="mr-2" /> Privacy Policy
                    </Link>
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
