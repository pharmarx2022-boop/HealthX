
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
import { signInWithOtp, sendOtp, MOCK_OTP } from '@/lib/auth';
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
        await sendOtp(values.email);
         if(values.referralCode) {
            sessionStorage.setItem('referralCode', values.referralCode);
        }
        setMagicLinkSent(true);
        toast({
            title: "Magic Link Sent!",
            description: "A sign-in link has been sent to your email. For testing, you can use the bypass button.",
        })
    } catch(error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  const handleTestSignIn = async () => {
    setIsSigningIn(true);
    if (!selectedRole) {
        toast({ title: "Error", description: "No role selected.", variant: "destructive" });
        setIsSigningIn(false);
        return;
    }
    
    const email = form.getValues('email');
    const referralCode = sessionStorage.getItem('referralCode') || undefined;
    
    const { user, error, isNewUser } = signInWithOtp(email, MOCK_OTP, selectedRole, referralCode);

    if (error) {
        toast({ title: "Sign-in Failed", description: error, variant: "destructive" });
    } else if (user) {
        sessionStorage.setItem('user', JSON.stringify(user));
        toast({ title: "Signed In Successfully!", description: `Welcome, ${user.fullName || user.email}` });

        if (isNewUser) {
            addNotification(user.id, {
                title: 'Welcome to HealthX!',
                message: `Your account has been created. Start exploring your dashboard.`,
                icon: 'login',
            });
        }
        
        // Redirect logic
        let redirectPath = '/';
        if (user.role === 'admin') redirectPath = '/admin';
        else if (user.role === 'patient') redirectPath = '/patient/my-health';
        else redirectPath = `/${user.role}/dashboard`;
        
        router.push(redirectPath);
    }
    
    if(referralCode) {
        sessionStorage.removeItem('referralCode');
    }
    setIsSigningIn(false);
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
                {magicLinkSent ? 'Check your email for a sign-in link or use the test button.' : 'Enter your email to receive a magic link to sign in.'}
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
                    <p className="font-medium">Check your inbox!</p>
                    <p>A sign-in link has been sent to <br/><strong>{form.getValues('email')}</strong>.</p>
                     
                    <div className="space-y-2">
                        <Button className="w-full" onClick={handleTestSignIn} disabled={isSigningIn}>
                            {isSigningIn ? <Loader2 className="animate-spin" /> : 'Bypass for Testing'}
                        </Button>
                        <Button variant="link" className="w-full" onClick={() => setMagicLinkSent(false)}>
                            Use a different email
                        </Button>
                    </div>
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
