
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Loader2, Upload, Percent } from 'lucide-react';
import { initialPharmacies } from '@/lib/mock-data';

const PHARMACIES_KEY = 'mockPharmacies';

const profileSchema = z.object({
  name: z.string().min(1, 'Pharmacy name is required.'),
  location: z.string().min(1, 'Location is required.'),
  image: z.string().min(1, 'A pharmacy picture is required.'),
  discount: z.coerce.number().min(15, 'Discount must be at least 15%.').max(100, 'Discount cannot exceed 100%.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function PharmacyProfileForm() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [pharmacies, setPharmacies] = useState(initialPharmacies);
  
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const storedPharmacies = sessionStorage.getItem(PHARMACIES_KEY);
      if (!storedPharmacies) {
        sessionStorage.setItem(PHARMACIES_KEY, JSON.stringify(initialPharmacies));
      } else {
        setPharmacies(JSON.parse(storedPharmacies));
      }
    }
  }, []);

  const pharmacyData = pharmacies.find(p => p.id === user?.id);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      location: '',
      image: '',
      discount: 15,
    },
  });

  useEffect(() => {
    if (pharmacyData) {
      form.reset(pharmacyData);
    }
  }, [pharmacyData, form]);
  
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
    if (!pharmacyData) return;

    const updatedPharmacies = pharmacies.map(p => {
        if (p.id === pharmacyData.id) {
            return { ...p, ...data };
        }
        return p;
    });

    sessionStorage.setItem(PHARMACIES_KEY, JSON.stringify(updatedPharmacies));
    setPharmacies(updatedPharmacies);

    toast({
      title: 'Profile Updated!',
      description: 'Your pharmacy details have been saved successfully.',
    });
  };
  
  if (!isClient || !pharmacyData) {
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
                <h3 className="font-semibold mb-2">Pharmacy Picture</h3>
                <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                    {currentImage ? (
                        <Image src={currentImage} alt="Pharmacy Preview" fill style={{objectFit:"cover"}} data-ai-hint="pharmacy exterior" />
                    ) : (
                        <div className="bg-slate-100 h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                            No Image
                        </div>
                    )}
                </div>
                <FormField control={form.control} name="image" render={() => (
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
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Pharmacy Name</FormLabel>
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
                            <Input placeholder="e.g., Shop 5, Andheri West" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Health Points Discount</FormLabel>
                        <div className="relative">
                             <FormControl>
                                <Input type="number" placeholder="e.g. 15" {...field} className="pl-8"/>
                            </FormControl>
                            <Percent className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                        <FormDescription>Minimum 15%. This is the discount patients get when they redeem Health Points at your pharmacy.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="animate-spin mr-2" />}
                    Save Changes
                </Button>
            </div>
        </form>
    </Form>
  );
}
