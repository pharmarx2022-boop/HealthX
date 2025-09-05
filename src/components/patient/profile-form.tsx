
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Phone } from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required.'),
  phone: z.string().min(10, 'A valid 10-digit phone number is required.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function PatientProfileForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      phone: '',
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
            phone: u.phone || '',
        });
      }
      setIsLoading(false);
    }
  }, [form]);

  const onSubmit = (data: ProfileFormValues) => {
    if (!user?.id) return;
    
    // In a real app, you'd save this to a database. Here we update sessionStorage.
    const updatedUser = { ...user, fullName: data.fullName, phone: data.phone };
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    // We also need to update the mock patient data if this user has appointments
    const allPatients = JSON.parse(sessionStorage.getItem('mockPatientData') || '[]');
    const updatedPatients = allPatients.map((p: any) => p.id === user.id ? {...p, name: data.fullName, phone: data.phone} : p);
    sessionStorage.setItem('mockPatientData', JSON.stringify(updatedPatients));


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
            
            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting && <Loader2 className="animate-spin mr-2" />}
                Save Profile Changes
            </Button>
        </form>
    </Form>
  );
}
