
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
import { Loader2, Upload, Percent, Phone, Copy, Link as LinkIcon, MapPin } from 'lucide-react';
import { initialLabs } from '@/lib/mock-data';

const LABS_KEY = 'mockLabs';

const profileSchema = z.object({
  name: z.string().min(1, 'Lab name is required.'),
  location: z.string().min(1, 'Location is required.'),
  image: z.string().min(1, 'A lab picture is required.'),
  discount: z.coerce.number().min(30, 'Discount must be at least 30%.').max(100, 'Discount cannot exceed 100%.'),
  whatsappNumber: z.string().min(10, 'A valid phone number is required.'),
  referralCode: z.string().optional(),
  googleMapsLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function LabProfileForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      location: '',
      image: '',
      discount: 30,
      whatsappNumber: '',
      referralCode: '',
      googleMapsLink: '',
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user');
      const u = storedUser ? JSON.parse(storedUser) : null;
      setUserId(u?.id);

      const storedLabs = sessionStorage.getItem(LABS_KEY);
      const allLabs = storedLabs ? JSON.parse(storedLabs) : initialLabs;
      
      if (!storedLabs) {
        sessionStorage.setItem(LABS_KEY, JSON.stringify(initialLabs));
      }

      const labData = allLabs.find((d: any) => d.id === u?.id);
      
      if (labData) {
        form.reset(labData);
      }
       if (u) {
        form.setValue('referralCode', u.referralCode);
      }
      setIsLoading(false);
    }
  }, [form]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('image', reader.result as string);
        form.clearErrors('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    if (!userId) return;

    const storedLabs = sessionStorage.getItem(LABS_KEY);
    const allLabs = storedLabs ? JSON.parse(storedLabs) : initialLabs;

    const updatedLabs = allLabs.map(p => {
        if (p.id === userId) {
            return { ...p, ...data };
        }
        return p;
    });

    sessionStorage.setItem(LABS_KEY, JSON.stringify(updatedLabs));

    toast({
      title: 'Profile Updated!',
      description: 'Your lab details have been saved successfully.',
    });
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

  if (isLoading) {
    return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary"/>
            <p className="ml-4 text-muted-foreground">Loading profile...</p>
        </div>
    );
  }

  const currentImage = form.watch('image');

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <h3 className="font-semibold mb-2">Lab Picture</h3>
                <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                    {currentImage ? (
                        <Image src={currentImage} alt="Lab Preview" fill style={{objectFit:"cover"}} data-ai-hint="lab exterior" />
                    ) : (
                        <div className="bg-slate-100 h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                            No Image
                        </div>
                    )}
                </div>
                 <FormField control={form.control} name="image" render={({ field }) => (
                    <FormItem className="mt-4">
                        <FormControl>
                             <div>
                                <Input 
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden" 
                                />
                                <label htmlFor="image-upload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full">
                                    <Upload className="mr-2" />
                                    Upload from Device
                                </label>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
            <div className="md:col-span-2 space-y-6">
                 <FormField control={form.control} name="referralCode" render={({ field }) => (
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
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Lab Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Metropolis Lab" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl><Input placeholder="e.g., Near Andheri Station" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="whatsappNumber" render={({ field }) => (
                    <FormItem>
                        <FormLabel>WhatsApp Number</FormLabel>
                        <FormControl>
                            <div className="relative">
                                 <Input type="tel" placeholder="e.g., 919876543210" {...field} className="pl-8"/>
                                 <Phone className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                        </FormControl>
                         <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="googleMapsLink" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Google Map Link</FormLabel>
                        <FormControl>
                            <div className="relative">
                                 <Input type="url" placeholder="https://maps.app.goo.gl/..." {...field} className="pl-8"/>
                                 <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="discount" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Health Points Discount</FormLabel>
                        <FormControl>
                             <div className="relative">
                                <Input type="number" placeholder="e.g. 30" {...field} className="pl-8" min="30" />
                                <Percent className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                        </FormControl>
                        <p className="text-sm text-muted-foreground">Minimum 30%. This is the discount patients get when they redeem Health Points at your lab.</p>
                        <FormMessage />
                    </FormItem>
                )} />
                
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="animate-spin mr-2" />}
                    Save Changes
                </Button>
            </div>
        </form>
    </Form>
  );
}

    