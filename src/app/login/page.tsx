

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
import { MailCheck, Loader2, KeyRound } from 'lucide-react';
import { addNotification } from '@/lib/notifications';

const loginSchema = z.object({
  email: z.string().email({ message: 'A valid email address is required.' }),
  otp: z.string().optional(),
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
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      otp: '',
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


  const handleSendOtp = async (values: z.infer<typeof loginSchema>) => {
    try {
        await sendOtp(values.email);
         if(values.referralCode) {
            sessionStorage.setItem('referralCode', values.referralCode);
        }
        setOtpSent(true);
        toast({
            title: "OTP Sent!",
            description: "An OTP has been sent to your email. (For demo, use 123456)",
        })
    } catch(error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  const handleVerifyOtp = async (values: z.infer<typeof loginSchema>) => {
    if (!selectedRole || !values.otp) {
        form.setError('otp', { message: 'OTP is required.' });
        return;
    };
    setIsVerifying(true);
    const referralCode = sessionStorage.getItem('referralCode') || undefined;

    setTimeout(() => { // Simulate network delay
        const { user, error, isNewUser } = signInWithOtp(values.email, values.otp, selectedRole, referralCode);

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
        setIsVerifying(false);
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
                {otpSent ? 'An OTP has been sent to your email.' : 'Enter your email to receive a One-Time Password (OTP).'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
            <form className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} disabled={otpSent} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                {otpSent && (
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>One-Time Password (OTP)</FormLabel>
                            <FormControl>
                                 <div className="relative">
                                    <Input placeholder="Enter your 6-digit OTP" {...field} />
                                    <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                 {selectedRole !== 'patient' && !otpSent && (
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
                     {!otpSent ? (
                        <Button type="button" className="w-full" onClick={form.handleSubmit(handleSendOtp)} disabled={form.formState.isSubmitting}>
                             {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Send OTP"}
                        </Button>
                     ) : (
                        <Button type="button" className="w-full" onClick={form.handleSubmit(handleVerifyOtp)} disabled={isVerifying}>
                            {isVerifying ? <Loader2 className="animate-spin" /> : "Sign In with OTP"}
                        </Button>
                     )}
                </div>

                {otpSent && (
                     <Button variant="link" className="w-full" onClick={() => {
                         setOtpSent(false);
                         form.setValue('otp', '');
                         form.clearErrors('otp');
                     }}>
                        Use a different email
                    </Button>
                )}
            </form>
            </Form>
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
