
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { updateUserPassword } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

const setPasswordSchema = z.object({
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], // path of error
});

export default function SetPasswordPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof setPasswordSchema>>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        // This page is for new users who don't have a password yet.
        // If an existing user with a password lands here, redirect them.
        if (u.password) {
            router.replace(`/${u.role}/dashboard`);
        } else {
             setUser(u);
        }
      } else {
        // No user in session, redirect to login
        router.replace('/login');
      }
      setIsLoading(false);
    }
  }, [router]);

  function onSubmit(values: z.infer<typeof setPasswordSchema>) {
    if (!user) {
        toast({ title: "Error", description: "No user session found.", variant: "destructive" });
        return;
    }
    
    const success = updateUserPassword(user.id, user.role, values.password);

    if (success) {
        // Update user in session storage with the new password
        const updatedUser = { ...user, password: values.password };
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Cleanup email from sign-in flow
        localStorage.removeItem('emailForSignIn');

        toast({
            title: 'Password Set Successfully!',
            description: 'You can now log in with your new password.',
        });

        const dashboardPath = user.role === 'admin' ? '/admin' 
                           : user.role === 'patient' ? '/patient/my-health'
                           : `/${user.role}/dashboard`;
        router.push(dashboardPath);

    } else {
        toast({
            title: 'Failed to Set Password',
            description: 'Could not update your password. Please try again.',
            variant: 'destructive',
        });
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Set Your Password</CardTitle>
            <CardDescription>Welcome! Create a password for your new account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Save Password & Continue"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
