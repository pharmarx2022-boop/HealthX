'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, User, Pill, FlaskConical, Briefcase } from 'lucide-react';

const roles = [
  {
    name: 'Doctor',
    icon: Stethoscope,
    description: 'Manage your appointments, clinics, and patient interactions with ease.',
    link: '/register/doctor',
    cta: 'Join as a Doctor',
  },
  {
    name: 'Patient',
    icon: User,
    description: 'Book appointments, manage your health, and utilize wallet rewards.',
    link: '/register/patient',
    cta: 'Join as a Patient',
  },
  {
    name: 'Pharmacy',
    icon: Pill,
    description: 'List your offers and connect with patients through our wallet system.',
    link: '/register/pharmacy',
    cta: 'Join as a Pharmacy',
  },
  {
    name: 'Lab',
    icon: FlaskConical,
    description: 'Expand your reach by offering services to our growing user base.',
    link: '/register/lab',
    cta: 'Join as a Lab',
  },
  {
    name: 'Agent',
    icon: Briefcase,
    description: 'Book appointments for others and earn commissions for your efforts.',
    link: '/register/agent',
    cta: 'Join as an Agent',
  },
];

export function RoleCards() {
  return (
    <section className="py-16 md:py-24 bg-slate-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Who Are You?</h2>
          <p className="text-lg text-muted-foreground mt-2">Choose your role to get started.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roles.map((role) => (
            <Card key={role.name} className="flex flex-col text-center items-center hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <role.icon className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="font-headline">{role.name}</CardTitle>
                <CardDescription className="px-4">{role.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end w-full px-6 pb-6">
                <Button asChild className="w-full" variant="secondary">
                  <Link href={role.link}>{role.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
