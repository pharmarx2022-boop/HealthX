

'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Loader2, Upload, Copy, BadgeCheck, FileText, IdCard } from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required.'),
  referralCode: z.string().optional(),
  aadharNumber: z.string().min(12, 'Aadhar must be 12 digits.').max(12, 'Aadhar must be 12 digits.'),
  aadharFrontImage: z.string().min(1, 'Front image is required.'),
  aadharBackImage: z.string().min(1, 'Back image is required.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function HealthCoordinatorProfileForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      referralCode: '',
      aadharNumber: '',
      aadharFrontImage: '',
      aadharBackImage: '',
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
            referralCode: u.referralCode || '',
            aadharNumber: u.aadharNumber || '',
            aadharFrontImage: u.aadharFrontImage || '',
            aadharBackImage: u.aadharBackImage || '',
        });
      }
      setIsLoading(false);
    }
  }, [form]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, fieldName: 'aadharFrontImage' | 'aadharBackImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue(fieldName, reader.result as string);
        form.clearErrors(fieldName);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const copyToClipboard = () => {
    const referralCode = form.getValues('referralCode');
    if(!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    toast({
        title: "Copied to Clipboard!",
        description: "Your referral code has been copied."
    })
  }

  const onSubmit = (data: ProfileFormValues) => {
    if (!user?.id) return;
    
    // In a real app, you'd save this to a database. Here we update sessionStorage.
    const updatedUser = { ...user, ...data };
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);

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

  const aadharFrontImage = form.watch('aadharFrontImage');
  const aadharBackImage = form.watch('aadharBackImage');

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
                control={form.control}
                name="referralCode"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Your Referral Code</FormLabel>
                     <div className="flex items-center gap-2">
                        <FormControl>
                            <Input readOnly {...field} />
                        </FormControl>
                            <Button type="button" variant="outline" size="icon" onClick={copyToClipboard}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                     <p className="text-sm text-muted-foreground pt-1">
                        Share this code with new partners. You'll earn a commission once they meet their activity milestones.
                    </p>
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

            <div className="space-y-4 p-4 border rounded-md bg-slate-50">
                <h3 className="font-semibold text-base flex items-center gap-2"><BadgeCheck/> Verification Details</h3>
                <p className="text-sm text-muted-foreground">This information is required for admin approval and is not displayed publicly.</p>
                 <FormField
                    control={form.control}
                    name="aadharNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Aadhar Card Number</FormLabel>
                        <FormControl>
                             <div className="relative">
                                <Input placeholder="Enter your 12-digit Aadhar number" {...field} className="pl-8"/>
                                <IdCard className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField control={form.control} name="aadharFrontImage" render={() => (
                        <FormItem>
                            <FormLabel>Aadhar Front Side</FormLabel>
                            <FormControl>
                                <div>
                                    <Input 
                                        id="aadhar-front-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'aadharFrontImage')}
                                        className="hidden" 
                                    />
                                    <label htmlFor="aadhar-front-upload" className="cursor-pointer">
                                        <div className="relative w-full aspect-video rounded-md border-2 border-dashed flex items-center justify-center text-muted-foreground hover:border-primary transition-colors">
                                            {aadharFrontImage ? (
                                                <Image src={aadharFrontImage} alt="Aadhar Front Preview" fill className="object-contain p-2" />
                                            ) : (
                                                <div className="text-center">
                                                    <Upload className="mx-auto" />
                                                    <p>Click to upload</p>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                      <FormField control={form.control} name="aadharBackImage" render={() => (
                        <FormItem>
                            <FormLabel>Aadhar Back Side</FormLabel>
                            <FormControl>
                                <div>
                                    <Input 
                                        id="aadhar-back-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'aadharBackImage')}
                                        className="hidden" 
                                    />
                                    <label htmlFor="aadhar-back-upload" className="cursor-pointer">
                                        <div className="relative w-full aspect-video rounded-md border-2 border-dashed flex items-center justify-center text-muted-foreground hover:border-primary transition-colors">
                                            {aadharBackImage ? (
                                                <Image src={aadharBackImage} alt="Aadhar Back Preview" fill className="object-contain p-2" />
                                            ) : (
                                                <div className="text-center">
                                                    <Upload className="mx-auto" />
                                                    <p>Click to upload</p>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
            </div>
            
            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting && <Loader2 className="animate-spin mr-2" />}
                Save Profile Changes
            </Button>
        </form>
    </Form>
  );
}
