

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
import { signInWithOtp, sendOtp } from '@/lib/auth';
import { MailCheck, Loader2 } from 'lucide-react';
import { addNotification } from '@/lib/notifications';

const loginSchema = z.object({
  email: z.string().email({ message: 'A valid email address is required.' }),
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
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
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
  }, [searchParams, router, toast]);


  const handleSendMagicLink = async (values: z.infer<typeof loginSchema>) => {
    try {
        await sendOtp(values.email); // Re-using the same mock OTP sender
         if(values.referralCode) {
            sessionStorage.setItem('referralCode', values.referralCode);
        }
        setMagicLinkSent(true);
        toast({
            title: "Magic Link Sent!",
            description: "A sign-in link has been sent to your email. (For demo, click 'Sign In' below)",
        })
    } catch(error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  const handleSignIn = async () => {
    if (!selectedRole) return;
    setIsSigningIn(true);
    const email = form.getValues('email');
    const referralCode = sessionStorage.getItem('referralCode') || undefined;

    // Simulate clicking the magic link by using the mock OTP
    setTimeout(() => { 
        const { user, error, isNewUser } = signInWithOtp(email, '123456', selectedRole, referralCode);

        if (user) {
            sessionStorage.setItem('user', JSON.stringify(user));
            if (referralCode) sessionStorage.removeItem('referralCode');
            const dashboardPath = user.role === 'admin' ? '/admin' 
                           : user.role === 'patient' ? '/patient/my-health'
                           : `/${user.role}/dashboard`;

            if (isNewUser) {
                addNotification(user.id, {
                    title: 'Welcome to HealthLink Hub!',
                    message: 'Your account is ready. Complete your profile to get started.',
                    icon: 'login',
                    href: `/${user.role}/profile`
                });
            } else {
                 addNotification(user.id, {
                    title: 'Login Successful',
                    message: 'You have successfully logged in.',
                    icon: 'login',
                    href: dashboardPath
                });
            }
             if (user.status === 'pending') {
                toast({
                    title: "Account Pending Approval",
                    description: "Some features are disabled until admin approval.",
                    duration: 9000,
                });
            }
            router.push(dashboardPath);

        } else {
            toast({
                title: "Login Failed",
                description: error || "An unknown error occurred.",
                variant: "destructive"
            });
        }
        setIsSigningIn(false);
    }, 1000);
  }
  
  const roleDisplayName = selectedRole ? (selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)).replace('-coordinator', ' Coordinator') : '';


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">{roleDisplayName} Login</CardTitle>
            <CardDescription>
                {magicLinkSent ? 'Check your email for a sign-in link.' : 'Enter your email to receive a magic link to sign in.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!magicLinkSent ? (
              <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSendMagicLink)} className="space-y-4">
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
                      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                           {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Send Magic Link"}
                      </Button>
                  </div>
              </form>
              </Form>
            ) : (
                <div className="text-center space-y-4">
                    <MailCheck className="mx-auto h-12 w-12 text-green-500"/>
                    <p>A sign-in link has been sent to <strong>{form.getValues('email')}</strong>.</p>
                    <p className="text-sm text-muted-foreground">(For demonstration purposes, you can click the button below to sign in immediately.)</p>
                    <Button onClick={handleSignIn} className="w-full" disabled={isSigningIn}>
                        {isSigningIn ? <Loader2 className="animate-spin" /> : "Sign In"}
                    </Button>
                     <Button variant="link" className="w-full" onClick={() => setMagicLinkSent(false)}>
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
