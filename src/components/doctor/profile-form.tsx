
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Loader2, Upload, Briefcase } from 'lucide-react';
import { initialDoctors } from '@/lib/mock-data';

// This would typically come from a central store or API
const DOCTORS_KEY = 'doctorsData';


const profileSchema = z.object({
  name: z.string().min(1, 'Full name is required.'),
  specialty: z.string().min(1, 'Specialty is required.'),
  location: z.string().min(1, 'Location is required.'),
  bio: z.string().min(1, 'A short bio is required.'),
  image: z.string().min(1, 'A profile picture is required.'),
  experience: z.coerce.number().min(0, 'Experience must be a positive number.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [doctors, setDoctors] = useState(initialDoctors);
  
  // Initialize sessionStorage on client mount
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const storedDoctors = sessionStorage.getItem(DOCTORS_KEY);
      if (!storedDoctors) {
        sessionStorage.setItem(DOCTORS_KEY, JSON.stringify(initialDoctors));
      } else {
        setDoctors(JSON.parse(storedDoctors));
      }
    }
  }, []);

  const doctorData = doctors.find(d => d.id === (user?.id || '1'));

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      specialty: '',
      location: '',
      bio: '',
      image: '',
      experience: 0,
    },
  });

  useEffect(() => {
    if (doctorData) {
      form.reset(doctorData);
    }
  }, [doctorData, form]);
  
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('image', reader.result as string);
        form.clearErrors('image'); // Clear error after successful upload
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    if (!doctorData) return;

    const updatedDoctors = doctors.map(d => {
        if (d.id === doctorData.id) {
            return { ...d, ...data };
        }
        return d;
    });

    sessionStorage.setItem(DOCTORS_KEY, JSON.stringify(updatedDoctors));
    setDoctors(updatedDoctors);

    toast({
      title: 'Profile Updated!',
      description: 'Your changes have been saved successfully.',
    });
  };
  
  if (!isClient || !doctorData) {
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
                <h3 className="font-semibold mb-2">Profile Picture</h3>
                <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                    {currentImage ? (
                        <Image src={currentImage} alt="Profile Preview" fill style={{objectFit:"cover"}} data-ai-hint="doctor portrait" />
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
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Dr. Anjali Sharma" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="specialty"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Specialty</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Cardiologist" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Years of Experience</FormLabel>
                             <FormControl>
                                <div className="relative">
                                    <Input type="number" placeholder="e.g., 15" {...field} className="pl-8"/>
                                    <Briefcase className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Mumbai, IN" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Bio / Experience</FormLabel>
                        <FormControl>
                            <Textarea rows={5} placeholder="Tell patients a little about yourself..." {...field} />
                        </FormControl>
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
