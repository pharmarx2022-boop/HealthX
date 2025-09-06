
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, User, Briefcase, Pill, Beaker, ChevronRight } from 'lucide-react';

const roles = [
  {
    name: 'Doctor',
    icon: Stethoscope,
    description: 'Manage your appointments and clinics.',
    loginLink: '/login?role=doctor',
  },
  {
    name: 'Patient',
    icon: User,
    description: 'Book appointments and view your records.',
    loginLink: '/login?role=patient',
  },
  {
    name: 'Health Coordinator',
    icon: Briefcase,
    description: 'Help others book and earn commissions.',
    loginLink: '/login?role=health-coordinator',
  },
  {
    name: 'Pharmacy',
    icon: Pill,
    description: 'Redeem Health Points for patients.',
    loginLink: '/login?role=pharmacy',
  },
  {
    name: 'Lab',
    icon: Beaker,
    description: 'Upload reports and redeem Health Points.',
    loginLink: '/login?role=lab',
  },
];

export function RoleCards() {
  return (
    <section id="roles" className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Log in to Your Dashboard</h2>
          <p className="text-lg text-muted-foreground mt-2">Select your role to get started.</p>
        </div>

        {/* Mobile View: Compact List */}
        <div className="max-w-md mx-auto md:hidden">
            <div className="bg-white rounded-lg border shadow-sm divide-y">
                {roles.map((role) => (
                    <Link href={role.loginLink} key={role.name} className="block p-4 hover:bg-slate-50/70 active:bg-slate-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <role.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-lg">{role.name}</p>
                                    <p className="text-sm text-muted-foreground">{role.description}</p>
                                </div>
                            </div>
                            <ChevronRight className="text-muted-foreground"/>
                        </div>
                    </Link>
                ))}
            </div>
        </div>

        {/* Desktop View: Cards */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {roles.map((role) => (
            <Card key={role.name} className="flex flex-col text-center items-center hover:shadow-xl transition-shadow duration-300 p-4 justify-between">
              <CardHeader className="items-center p-2">
                <div className="p-3 bg-primary/10 rounded-full mb-2">
                  <role.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl">{role.name}</CardTitle>
                 <CardDescription className="text-sm pt-1">{role.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end w-full p-2">
                <Button asChild className="w-full" variant="outline">
                    <Link href={role.loginLink}>Login</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
