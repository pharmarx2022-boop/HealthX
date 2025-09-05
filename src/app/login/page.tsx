

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { loginWithOtp, MOCK_OTP } from '@/lib/auth';
import { sendLoginOtpNotification, addNotification } from '@/lib/notifications';

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
        // Redirect or show an error if the role is invalid/missing
        toast({
            title: "Invalid Role",
            description: "Please select a role from the homepage.",
            variant: "destructive",
        });
        router.push('/');
    }
  }, [searchParams, router, toast]);


  const handleSendOtp = () => {
    const email = form.getValues('email');
    if (form.getValues('email')) {
      setOtpSent(true);
      sendLoginOtpNotification(email);
      toast({
        title: "OTP Sent!",
        description: `An OTP has been sent to ${email} and as an in-app notification. For testing purposes, your OTP is: ${MOCK_OTP}`,
      });
    } else {
        form.setError("email", { type: "manual", message: "Please enter a valid email address." })
    }
  };

  function onSubmit(values: z.infer<typeof loginSchema>) {
    if (!selectedRole) {
        toast({
            title: "Login Failed",
            description: "No role selected. Please go back to the homepage and select a role.",
            variant: "destructive",
        });
        return;
    }

    if (!otpSent) {
        handleSendOtp();
        return;
    }

    const { user, error, isNewUser } = loginWithOtp(values.email, values.otp!, selectedRole, values.referralCode);
    if (user) {
        toast({
            title: "Login Successful!",
            description: "Welcome back to HealthLink Hub.",
        });
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('user', JSON.stringify(user));
        }

        // Add a welcome notification
        addNotification(user.id, isNewUser ? 'Welcome to HealthLink Hub! Your account is ready.' : 'You have successfully logged in.');
        
        if (user.status === 'pending') {
             toast({
                title: "Account Pending Approval",
                description: "Your account is active for viewing and profile updates, but some features are disabled until admin approval.",
                duration: 9000,
            });
        }

        if(selectedRole === 'admin') {
            router.push('/admin');
        } else if (selectedRole === 'patient' || selectedRole === 'health-coordinator') {
            router.push('/book-appointment');
        }
        else {
            router.push(`/${selectedRole}/dashboard`);
        }
    } else {
        toast({
            title: "Login Failed",
            description: error || "Invalid OTP. Please try again.",
            variant: "destructive",
        })
    }
  }
  
  const roleDisplayName = selectedRole ? (selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)).replace('-coordinator', ' Coordinator') : '';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">{roleDisplayName} Login / Sign Up</CardTitle>
            <CardDescription>Sign in with your email address to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
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
                  <>
                    <FormField
                      control={form.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OTP</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Enter the 6-digit OTP" {...field} />
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
                  </>
                )}
                
                <Button type="submit" className="w-full">
                  {otpSent ? 'Verify OTP & Login' : 'Send OTP'}
                </Button>
                {otpSent && <Button type="button" variant="link" className="w-full" onClick={() => setOtpSent(false)}>Change Email</Button>}
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
                Not a {roleDisplayName}? <Link href="/" className="underline">Go back</Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
