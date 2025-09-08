
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
import { signInWithPassword, sendOtp, signInWithOtp, checkUserExists, UserData } from '@/lib/auth';
import { MailCheck, Loader2 } from 'lucide-react';
import { addNotification } from '@/lib/notifications';

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
  const [loginStep, setLoginStep] = useState<'enterEmail' | 'enterPassword' | 'magicLinkSent'>('enterEmail');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [existingUser, setExistingUser] = useState<UserData | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      referralCode: '',
    },
  });
  
  const emailValue = form.watch('email');

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
    // In a production app, you would check for the magic link token in the URL here.
    // e.g., const token = searchParams.get('token');
    // if (token) { handleTokenLogin(token); }

  }, [searchParams, router, toast]);
  
  const handleSuccessfulLogin = (user: UserData, isNewUser: boolean) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    toast({ title: "Signed In Successfully!", description: `Welcome, ${user.fullName || user.email}` });

    if (isNewUser) {
        addNotification(user.id, {
            title: 'Welcome to HealthX!',
            message: `Your account has been created. Start exploring your dashboard.`,
            icon: 'login',
        });
    }
    
    let redirectPath = '/';
    if (user.role === 'admin') redirectPath = '/admin';
    else if (user.role === 'patient') redirectPath = '/patient/my-health';
    else redirectPath = `/${user.role}/dashboard`;
    
    router.push(redirectPath);
    if(sessionStorage.getItem('referralCode')) {
        sessionStorage.removeItem('referralCode');
    }
  }
  
  const handleCheckEmail = async ({ email, referralCode }: z.infer<typeof loginSchema>) => {
    if (!selectedRole) return;
    setIsSubmitting(true);
    
    if (referralCode) {
        sessionStorage.setItem('referralCode', referralCode);
    }
    
    const user = await checkUserExists(email, selectedRole);
    setExistingUser(user);

    if (user && user.password) {
      setLoginStep('enterPassword');
    } else {
      await sendOtp(email);
      setLoginStep('magicLinkSent');
      toast({
          title: "Magic Link Sent!",
          description: "A sign-in link has been sent to your email. Please check your inbox to continue.",
      });
    }
    setIsSubmitting(false);
  }

  const handlePasswordLogin = async ({ email, password }: z.infer<typeof loginSchema>) => {
    if (!selectedRole || !password) return;
    setIsSubmitting(true);
    
    const { user, error } = await signInWithPassword(email, password, selectedRole);
    if (user) {
        handleSuccessfulLogin(user, false);
    } else {
        toast({ title: "Login Failed", description: error, variant: 'destructive' });
    }
    setIsSubmitting(false);
  }
  
  const handleSendMagicLinkAgain = async () => {
    setIsSubmitting(true);
    const email = form.getValues('email');
    await sendOtp(email);
    setLoginStep('magicLinkSent');
    toast({
        title: "Magic Link Sent!",
        description: "A new sign-in link has been sent to your email.",
    });
    setIsSubmitting(false);
  }
  
  const roleDisplayName = selectedRole ? (selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)).replace('-coordinator', ' Coordinator') : '';

  const renderContent = () => {
    switch (loginStep) {
      case 'enterPassword':
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePasswordLogin)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} readOnly disabled />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2 pt-2">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Sign In"}
                </Button>
                 <Button variant="link" size="sm" className="w-full" onClick={handleSendMagicLinkAgain} disabled={isSubmitting}>
                    Sign in with a magic link instead
                </Button>
              </div>
            </form>
          </Form>
        );
      case 'magicLinkSent':
        return (
          <div className="text-center space-y-4">
            <MailCheck className="mx-auto h-12 w-12 text-green-500" />
            <p className="font-medium">Check your inbox!</p>
            <p>A sign-in link has been sent to <br /><strong>{emailValue}</strong>.</p>
            <div className="space-y-2">
              <Button variant="link" className="w-full" onClick={() => setLoginStep('enterEmail')}>
                Use a different email
              </Button>
            </div>
          </div>
        );
      case 'enterEmail':
      default:
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCheckEmail)} className="space-y-4">
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
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Continue"}
                </Button>
              </div>
            </form>
          </Form>
        );
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">{roleDisplayName} Login</CardTitle>
            <CardDescription>
                {loginStep === 'enterPassword' && 'Welcome back! Enter your password to continue.'}
                {loginStep === 'magicLinkSent' && 'Check your email for a sign-in link.'}
                {loginStep === 'enterEmail' && 'Enter your email to sign in or create an account.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
           <CardFooter className="pt-6 text-center text-sm">
                Not a {roleDisplayName}? <Link href="/" className="underline">Go back</Link>
            </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
