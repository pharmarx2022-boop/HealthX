'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { loginWithOtp } from '@/lib/auth';

const loginSchema = z.object({
  phone: z.string().min(10, { message: 'A valid 10-digit phone number is required.' }).max(10, { message: 'A valid 10-digit phone number is required.' }),
  otp: z.string().optional(),
  role: z.enum(['doctor', 'patient', 'pharmacy', 'lab', 'agent']),
});

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [otpSent, setOtpSent] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '',
      otp: '',
      role: 'patient',
    },
  });

  const handleSendOtp = () => {
    const phone = form.getValues('phone');
    if (phone.length === 10) {
      setOtpSent(true);
      toast({
        title: "OTP Sent!",
        description: "A one-time password has been sent to your mobile.",
      });
    } else {
        form.setError("phone", { type: "manual", message: "Please enter a valid 10-digit phone number." })
    }
  };

  function onSubmit(values: z.infer<typeof loginSchema>) {
    if (!otpSent) {
        handleSendOtp();
        return;
    }

    const user = loginWithOtp(values.phone, values.otp!, values.role);
    if (user) {
        toast({
            title: "Login Successful!",
            description: "Welcome back to HealthLink Hub.",
        });
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('user', JSON.stringify(user));
        }
        router.push(`/${values.role}/dashboard`);
    } else {
        toast({
            title: "Login Failed",
            description: "Invalid OTP or role. Please try again.",
            variant: "destructive",
        })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Welcome!</CardTitle>
            <CardDescription>Sign in or create an account with your mobile number.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>I am a...</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="patient">Patient</SelectItem>
                          <SelectItem value="doctor">Doctor</SelectItem>
                           <SelectItem value="pharmacy">Pharmacy</SelectItem>
                          <SelectItem value="lab">Lab</SelectItem>
                          <SelectItem value="agent">Agent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="9876543210" {...field} disabled={otpSent} />
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
                        <FormLabel>OTP</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter the 6-digit OTP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <Button type="submit" className="w-full">
                  {otpSent ? 'Verify OTP & Login' : 'Send OTP'}
                </Button>
                {otpSent && <Button type="button" variant="link" className="w-full" onClick={() => setOtpSent(false)}>Change Number</Button>}
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
