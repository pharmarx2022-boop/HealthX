
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { sendAuthenticationLink, completeSignIn, signInWithPassword } from '@/lib/auth';
import { addNotification } from '@/lib/notifications';
import { MailCheck, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const loginSchema = z.object({
  email: z.string().email({ message: 'A valid email address is required.' }),
  password: z.string().optional(),
  referralCode: z.string().optional(),
});

type Role = 'doctor' | 'patient' | 'health-coordinator' | 'admin' | 'pharmacy' | 'lab';

const ALL_ROLES: Role[] = ['doctor', 'patient', 'health-coordinator', 'admin', 'pharmacy', 'lab'];

function isValidRole(role: any): role is Role {
    return ALL_ROLES.includes(role);
}


export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [linkSent, setLinkSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      referralCode: '',
    },
  });

  useEffect(() => {
    const roleFromQuery = searchParams.get('role');
    if (isValidRole(roleFromQuery)) {
        setSelectedRole(roleFromQuery);
    } else {
        toast({
            title: "Invalid Role",
            description: "Please select a role from the homepage.",
            variant: "destructive",
        });
        router.push('/');
    }
    
    // Check if the URL is a sign-in link
    if (searchParams.get('signIn') === 'true' && roleFromQuery) {
        setIsVerifying(true);
        const referralCode = sessionStorage.getItem('referralCode') || undefined;
        
        // Simulate a small delay for UX
        setTimeout(() => {
            const { user, error, isNewUser } = completeSignIn(window.location.href, roleFromQuery, referralCode);

            if (user) {
                sessionStorage.setItem('user', JSON.stringify(user));
                sessionStorage.removeItem('referralCode');
                const dashboardPath = user.role === 'admin' ? '/admin' 
                           : user.role === 'patient' ? '/patient/my-health'
                           : `/${user.role}/dashboard`;

                if (isNewUser) {
                     // Add a welcome notification
                    addNotification(user.id, {
                        title: 'Welcome to HealthLink Hub!',
                        message: 'Your account is ready. Complete your profile to get started.',
                        icon: 'login',
                        href: `/${user.role}/profile`
                    });
                     // Redirect to set password
                    router.push('/set-password');

                } else {
                    toast({
                        title: "Login Successful!",
                        description: "Welcome back to HealthLink Hub.",
                    });
                     addNotification(user.id, {
                        title: 'Login Successful',
                        message: 'You have successfully logged in.',
                        icon: 'login',
                        href: dashboardPath
                    });
                     if (user.status === 'pending') {
                        toast({
                            title: "Account Pending Approval",
                            description: "Your account is active for viewing and profile updates, but some features are disabled until admin approval.",
                            duration: 9000,
                        });
                    }
                    router.push(dashboardPath);
                }

            } else {
                toast({
                    title: "Login Failed",
                    description: error || "Invalid sign-in link. Please try again.",
                    variant: "destructive",
                });
                 setIsVerifying(false);
            }
        }, 1000);
    }
  }, [searchParams, router, toast, selectedRole]);


  const onSubmitPassword = (values: z.infer<typeof loginSchema>) => {
    if (!values.password) {
        form.setError('password', { message: 'Password is required for this login method.' });
        return;
    }
    if (!selectedRole) return;
    const { user, error } = signInWithPassword(values.email, values.password, selectedRole);

    if (user) {
        sessionStorage.setItem('user', JSON.stringify(user));
        const dashboardPath = user.role === 'admin' ? '/admin' 
                        : user.role === 'patient' ? '/patient/my-health'
                        : `/${user.role}/dashboard`;
        toast({
            title: "Login Successful!",
            description: "Welcome back to HealthLink Hub.",
        });
        router.push(dashboardPath);
    } else {
        toast({
            title: "Login Failed",
            description: error,
            variant: "destructive",
        });
    }
  };

  const onSubmitMagicLink = (values: z.infer<typeof loginSchema>) => {
    sendAuthenticationLink(values.email);
    if(values.referralCode) {
        sessionStorage.setItem('referralCode', values.referralCode);
    }
    setLinkSent(true);
  }
  
  const roleDisplayName = selectedRole ? (selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)).replace('-coordinator', ' Coordinator') : '';

  if (isVerifying) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h1 className="mt-4 text-2xl font-bold">Verifying your sign-in...</h1>
            <p className="text-muted-foreground">Please wait while we securely log you in.</p>
        </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">{roleDisplayName} Login</CardTitle>
            {!linkSent ? (
                <CardDescription>
                    For returning users, enter your email and password. For new users, enter your email and get a secure sign-in link.
                </CardDescription>
            ) : (
                <CardDescription>A sign-in link has been sent to your email address.</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {!linkSent ? (
                <Form {...form}>
                <form className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Password (for returning users)</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                     {selectedRole !== 'patient' && (
                        <FormField
                            control={form.control}
                            name="referralCode"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Referral Code (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter referral code if you have one" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                    <div className="space-y-2 pt-2">
                        <Button type="button" className="w-full" onClick={form.handleSubmit(onSubmitPassword)} disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Sign In with Password"}
                        </Button>
                        <div className="relative">
                            <Separator className="my-4"/>
                            <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">OR</span>
                        </div>
                         <Button type="button" variant="outline" className="w-full" onClick={form.handleSubmit(onSubmitMagicLink)} disabled={form.formState.isSubmitting}>
                            Email a Secure Sign-in Link
                        </Button>
                    </div>
                </form>
                </Form>
            ) : (
                <div className="text-center flex flex-col items-center">
                    <MailCheck className="w-16 h-16 text-primary mb-4"/>
                    <h3 className="font-semibold text-lg">Check Your Email</h3>
                    <p className="text-muted-foreground mt-2">
                        We've sent a magic link to <span className="font-medium text-foreground">{form.getValues('email')}</span>. Click the link in the email to sign in instantly.
                    </p>
                    <Button variant="link" onClick={() => setLinkSent(false)} className="mt-4">
                        Use a different email
                    </Button>
                </div>
            )}
            <CardFooter className="pt-6 text-center text-sm">
                Not a {roleDisplayName}? <Link href="/" className="underline">Go back</Link>
            </CardFooter>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
