
'use client';

import Link from 'next/link';
import { HeartPulse, Menu, X, UserCircle, LogOut, Settings, Briefcase, Users, Pill, Beaker, Gift, Bell, Calendar, LayoutDashboard, Info, Mail, ShieldCheck, FileText, ArrowLeft, Wallet, History, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetHeader } from '@/components/ui/sheet';
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
import { ScrollArea } from '../ui/scroll-area';


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
      if(user) {
        sessionStorage.removeItem(`notifications_${user.id}`);
      }
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
             {(user.role === 'patient' || user.role === 'health-coordinator' || user.role === 'pharmacy' || user.role === 'lab') && (
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
                            <Link href="/patient/my-health#appointments">
                               <Calendar className="mr-2" />
                                <span>Your Appointments</span>
                            </Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                            <Link href="/patient/my-health#reports">
                                <FileText className="mr-2" />
                                <span>My Reports</span>
                            </Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                            <Link href="/patient/my-health#wallet">
                                <Wallet className="mr-2" />
                                <span>Health Points</span>
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
              <LayoutDashboard className="mr-2" />
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
                    <Separator className="my-1" />
                    <Button variant="ghost" asChild className="justify-start text-lg">
                        <Link href="/patient/my-health" onClick={() => setIsSheetOpen(false)}>
                           <Calendar className="mr-2" />
                           Your Appointments
                        </Link>
                    </Button>
                     <Button variant="ghost" asChild className="justify-start text-lg">
                        <Link href="/patient/my-health?tab=reports" onClick={() => setIsSheetOpen(false)}>
                           <FileText className="mr-2" />
                           My Reports
                        </Link>
                    </Button>
                     <Button variant="ghost" asChild className="justify-start text-lg">
                        <Link href="/patient/my-health?tab=wallet" onClick={() => setIsSheetOpen(false)}>
                           <Wallet className="mr-2" />
                           Health Points
                        </Link>
                    </Button>
                     <Button variant="ghost" asChild className="justify-start text-lg">
                        <Link href="/patient/my-health?tab=reminders" onClick={() => setIsSheetOpen(false)}>
                           <Bell className="mr-2" />
                           Reminders
                        </Link>
                    </Button>
                    <Button variant="ghost" asChild className="justify-start text-lg">
                        <Link href="/patient/my-health?tab=family" onClick={() => setIsSheetOpen(false)}>
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
           <Separator className="my-1"/>
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
            <SheetContent side="right" className="w-[300px] flex flex-col p-0">
               <SheetHeader className="p-4 border-b">
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                  <div className="flex items-center justify-between">
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
               </SheetHeader>
                <ScrollArea className="flex-1">
                  <div className="p-4 flex-grow flex flex-col">
                    <nav className="flex flex-col gap-1 flex-grow">
                      {user ? (
                        renderMobileAuthButtons()
                      ) : (
                         <Button variant="default" asChild className="justify-start text-lg h-12">
                            <Link href="/#roles" onClick={() => setIsSheetOpen(false)}>
                                <UserCircle className="mr-2" />
                                Login / Sign Up
                            </Link>
                         </Button>
                      )}
                      
                      <Separator className="my-2"/>
                      
                      <Button variant="ghost" asChild className="justify-start text-base">
                        <Link href="/about" onClick={() => setIsSheetOpen(false)}>
                            <Info className="mr-2" /> About Us
                        </Link>
                      </Button>
                      <Button variant="ghost" asChild className="justify-start text-base">
                         <Link href="/contact" onClick={() => setIsSheetOpen(false)}>
                            <Mail className="mr-2" /> Contact Us
                        </Link>
                      </Button>
                       <Button variant="ghost" asChild className="justify-start text-base">
                         <Link href="/terms-of-service" onClick={() => setIsSheetOpen(false)}>
                            <FileText className="mr-2" /> Terms of Service
                        </Link>
                      </Button>
                       <Button variant="ghost" asChild className="justify-start text-base">
                         <Link href="/privacy-policy" onClick={() => setIsSheetOpen(false)}>
                            <ShieldCheck className="mr-2" /> Privacy Policy
                        </Link>
                      </Button>
                    </nav>
                  </div>
                </ScrollArea>
                 <div className="p-4 mt-auto border-t text-center text-xs text-muted-foreground space-y-1">
                    <p>© {new Date().getFullYear()} HealthX. All rights reserved.</p>
                     <p className="flex items-center justify-center gap-1.5">
                        Made in West Bengal <Heart className="w-3 h-3 text-red-500 fill-current" />
                    </p>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
