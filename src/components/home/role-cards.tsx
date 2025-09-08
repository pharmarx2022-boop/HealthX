
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, User, Briefcase, Pill, Beaker, ChevronRight } from 'lucide-react';

const roles = [
  {
    name: 'Doctor',
    description: 'Manage your appointments and clinics.',
    loginLink: '/login?role=doctor',
    icon: Stethoscope,
  },
  {
    name: 'Patient',
    description: 'Book appointments and view your records.',
    loginLink: '/login?role=patient',
    icon: User,
  },
  {
    name: 'Health Coordinator',
    description: 'Help others book and earn commissions.',
    loginLink: '/login?role=health-coordinator',
    icon: Briefcase,
  },
  {
    name: 'Pharmacy',
    description: 'Redeem Health Points for patients.',
    loginLink: '/login?role=pharmacy',
    icon: Pill,
  },
  {
    name: 'Lab',
    description: 'Upload reports and redeem Health Points.',
    loginLink: '/login?role=lab',
    icon: Beaker,
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
                    <Link key={role.name} href={role.loginLink} className="p-4 flex items-center gap-4 text-left w-full hover:bg-slate-50/70 transition-colors">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shrink-0">
                            <role.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-grow">
                            <p className="font-semibold text-lg">{role.name}</p>
                            <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                    </Link>
                ))}
            </div>
        </div>

        {/* Desktop View: Cards */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {roles.map((role) => (
            <Card key={role.name} className="flex flex-col text-center items-center hover:shadow-xl transition-shadow duration-300 p-4 justify-between">
              <CardHeader className="items-center p-2">
                 <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 text-primary mb-2 border-4 border-primary/20">
                    <role.icon className="w-12 h-12" />
                </div>
                <CardTitle className="font-headline text-xl">{role.name}</CardTitle>
                 <CardDescription className="text-sm pt-1">{role.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end w-full p-2">
                <Button asChild className="w-full">
                    <Link href={role.loginLink}>Login / Sign up</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
