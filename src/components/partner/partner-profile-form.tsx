
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
import { Loader2, Upload, Percent } from 'lucide-react';
import { mockPharmacies, mockLabs } from '@/lib/mock-data';

const PHARMACIES_KEY = 'mockPharmacies';
const LABS_KEY = 'mockLabs';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  location: z.string().min(1, 'Location is required.'),
  image: z.string().min(1, 'A picture is required.'),
  redemptionOffer: z.coerce.number().min(0, 'Offer must be at least 0.').max(100, 'Offer cannot exceed 100.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface PartnerProfileFormProps {
    partnerType: 'pharmacy' | 'lab';
}

export function PartnerProfileForm({ partnerType }: PartnerProfileFormProps) {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const PARTNERS_KEY = partnerType === 'pharmacy' ? PHARMACIES_KEY : LABS_KEY;
  const initialData = partnerType === 'pharmacy' ? mockPharmacies : mockLabs;

  const [partners, setPartners] = useState(initialData);
  
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const storedPartners = sessionStorage.getItem(PARTNERS_KEY);
      if (!storedPartners) {
        sessionStorage.setItem(PARTNERS_KEY, JSON.stringify(initialData));
      } else {
        setPartners(JSON.parse(storedPartners));
      }
    }
  }, [PARTNERS_KEY, initialData]);

  // For demo, we'll just edit the first partner in the list.
  // In a real app, you'd match this to the logged-in partner's ID.
  const partnerData = partners[0];

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      location: '',
      image: '',
      redemptionOffer: 0,
    },
  });

  useEffect(() => {
    if (partnerData) {
      form.reset(partnerData);
    }
  }, [partnerData, form]);
  
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
    if (!partnerData) return;

    const updatedPartners = partners.map(p => {
        if (p.id === partnerData.id) {
            return { ...p, ...data };
        }
        return p;
    });

    sessionStorage.setItem(PARTNERS_KEY, JSON.stringify(updatedPartners));
    setPartners(updatedPartners);

    toast({
      title: 'Profile Updated!',
      description: 'Your changes have been saved successfully.',
    });
  };
  
  if (!isClient || !partnerData) {
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border">
                {currentImage ? (
                    <Image src={currentImage} alt="Profile Preview" fill style={{objectFit:"cover"}} />
                ) : (
                    <div className="bg-slate-100 h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                        No Image
                    </div>
                )}
            </div>
             <FormField control={form.control} name="image" render={({ field }) => (
                <FormItem>
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
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Wellness Forever" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Andheri West, Mumbai" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="redemptionOffer"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Health Point Redemption Offer (%)</FormLabel>
                     <div className="relative">
                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <FormControl>
                            <Input type="number" className="pl-10" placeholder="e.g., 15" {...field} />
                        </FormControl>
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
            />
            
            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting && <Loader2 className="animate-spin mr-2" />}
                Save Changes
            </Button>
        </form>
    </Form>
  );
}
