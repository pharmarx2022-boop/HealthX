
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from '@/hooks/use-toast';

const baseSchemaObject = z.object({
  fullName: z.string().min(2, { message: 'Full name is required.' }),
  email: z.string().email({ message: 'A valid email is required.' }),
  phone: z.string().min(10, { message: 'A valid phone number is required.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string(),
});

const baseSchema = baseSchemaObject.refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const doctorSchema = baseSchemaObject.extend({
  registrationNumber: z.string().min(1, { message: 'Registration number is mandatory.' }),
  referralCode: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const patientSchema = baseSchema;
const agentSchema = baseSchema;

const pharmacyAndLabSchemaObject = baseSchemaObject.extend({
    businessName: z.string().min(2, { message: 'Business name is required.' }),
    address: z.string().min(10, { message: 'Address is required.' }),
});

const pharmacySchema = pharmacyAndLabSchemaObject.refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
const labSchema = pharmacySchema;

const roleSchemas = {
  doctor: doctorSchema,
  patient: patientSchema,
  agent: agentSchema,
  pharmacy: pharmacySchema,
  lab: labSchema,
};

type Role = keyof typeof roleSchemas;

const roleTitles: Record<Role, string> = {
    doctor: "Doctor Registration",
    patient: "Create Patient Account",
    pharmacy: "Pharmacy Registration",
    lab: "Lab Registration",
    agent: "Agent Registration"
}

export default function RegisterPage({ params }: { params: { role: Role } }) {
  const { role } = params;
  const currentSchema = roleSchemas[role] || patientSchema;
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      registrationNumber: '',
      referralCode: '',
      businessName: '',
      address: '',
    },
  });

  function onSubmit(values: z.infer<typeof currentSchema>) {
    console.log({ role, ...values });
    // Handle registration logic
    toast({
        title: "Account Created!",
        description: `Your ${role} account has been successfully created.`,
    });
  }

  const renderRoleSpecificFields = () => {
    switch (role) {
      case 'doctor':
        return (
          <>
            <FormField control={form.control} name="registrationNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Number</FormLabel>
                  <FormControl><Input placeholder="MCI12345" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="referralCode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Referral Code (Optional)</FormLabel>
                  <FormControl><Input placeholder="REF123" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case 'pharmacy':
      case 'lab':
        return (
            <>
                <FormField control={form.control} name="businessName" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl><Input placeholder="My Health Store" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl><Input placeholder="123 Health St, Medtown" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </>
        )
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-lg mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">{roleTitles[role] || "Create Account"}</CardTitle>
            <CardDescription>Join HealthLink Hub today. It's free and only takes a minute.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="john.doe@email.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="+1 123 456 7890" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          onPaste={(e) => {
                            e.preventDefault();
                            return false;
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {renderRoleSpecificFields()}
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" className="w-full !mt-6">Create Account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Registration?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Please review your information before creating your account.
                        Are you sure you want to proceed?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </form>
            </Form>
            <div className="mt-6 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
