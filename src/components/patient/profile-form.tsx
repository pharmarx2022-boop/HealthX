
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Phone, Mail } from 'lucide-react';
import { MOCK_OTP, isPhoneUnique } from '@/lib/auth';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required.'),
  email: z.string().email(),
  phone: z.string().min(10, 'A valid 10-digit phone number is required.'),
  otp: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function PatientProfileForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [originalPhone, setOriginalPhone] = useState('');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      otp: '',
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user');
      const u = storedUser ? JSON.parse(storedUser) : null;
      setUser(u);

      if (u) {
        form.reset({
            fullName: u.fullName || '',
            email: u.email || '',
            phone: u.phone || '',
        });
        setOriginalPhone(u.phone || '');
      }
      setIsLoading(false);
    }
  }, [form]);

  const onSubmit = (data: ProfileFormValues) => {
    if (!user?.id) return;
    
    if (!isPhoneUnique(data.phone, user.id)) {
      form.setError('phone', { type: 'manual', message: 'This phone number is already in use.' });
      return;
    }

    if (data.phone !== originalPhone) {
      if (!isVerifyingPhone) {
        setIsVerifyingPhone(true);
        toast({ title: 'Verify New Phone Number', description: `An OTP has been sent to ${data.phone}. Please enter it to confirm the change. (Demo OTP: ${MOCK_OTP})` });
        return;
      }
      
      if (data.otp !== MOCK_OTP) {
        form.setError('otp', { type: 'manual', message: 'Invalid OTP.' });
        return;
      }
    }

    const updatedUser = { ...user, fullName: data.fullName, phone: data.phone, email: data.email };
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    // We also need to update the mock patient data if this user has appointments
    const allPatients = JSON.parse(sessionStorage.getItem('mockPatientData') || '[]');
    const updatedPatients = allPatients.map((p: any) => p.id === user.id ? {...p, name: data.fullName, phone: data.phone} : p);
    sessionStorage.setItem('mockPatientData', JSON.stringify(updatedPatients));

    setOriginalPhone(data.phone);
    setIsVerifyingPhone(false);
    form.setValue('otp', '');
    form.clearErrors('otp');

    toast({
      title: 'Profile Updated!',
      description: 'Your changes have been saved successfully.',
    });
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary"/>
            <p className="ml-4 text-muted-foreground">Loading profile...</p>
        </div>
    );
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input type="email" readOnly disabled {...field} className="pl-8"/>
                            <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Rohan Sharma" {...field} />
                    </FormControl>
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
                         <div className="relative">
                            <Input type="tel" placeholder="Enter your 10-digit mobile number" {...field} className="pl-8"/>
                            <Phone className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            {isVerifyingPhone && (
                 <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Enter OTP</FormLabel>
                        <FormControl>
                            <Input placeholder="6-digit OTP" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}
            
            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting && <Loader2 className="animate-spin mr-2" />}
                Save Profile Changes
            </Button>
        </form>
    </Form>
  );
}
