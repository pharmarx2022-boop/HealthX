
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Loader2, Upload, Percent, Phone, Copy, Link as LinkIcon, MapPin, BadgeCheck, FileText, Mail, Calendar, Clock, Truck, KeyRound, Beaker, PlusCircle, Trash2 } from 'lucide-react';
import { initialLabs } from '@/lib/mock-data';
import { isRegistrationNumberUnique, isPhoneUnique } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';

const LABS_KEY = 'mockLabs';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

const healthPackageSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Package name is required.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  description: z.string().min(1, 'Description is required.'),
  tests: z.string().min(1, 'Please list at least one test.'),
});

const profileSchema = z.object({
  name: z.string().min(1, 'Lab name is required.'),
  email: z.string().email(),
  location: z.string().min(1, 'Location is required.'),
  image: z.string().min(1, 'A lab picture is required.'),
  discount: z.coerce.number().min(20, 'Discount must be at least 20%.').max(100, 'Discount cannot exceed 100%.'),
  phoneNumber: z.string().min(10, 'A valid phone number is required.'),
  referralCode: z.string().optional(),
  googleMapsLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  registrationNumber: z.string().min(1, 'Registration number is required.'),
  registrationCertificate: z.string().min(1, 'Registration certificate is required.'),
  otp: z.string().optional(),
  days: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one operating day.',
  }),
  hours: z.string().min(1, 'Operating hours are required.'),
  homeCollectionEnabled: z.boolean().default(false),
  collectionRadius: z.coerce.number().optional(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  healthPackages: z.array(healthPackageSchema).optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


type ProfileFormValues = z.infer<typeof profileSchema>;

export function LabProfileForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [originalPhone, setOriginalPhone] = useState('');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      location: '',
      image: '',
      discount: 20,
      phoneNumber: '',
      referralCode: '',
      googleMapsLink: '',
      registrationNumber: '',
      registrationCertificate: '',
      otp: '',
      days: [],
      hours: '',
      homeCollectionEnabled: false,
      collectionRadius: 5,
      password: '',
      confirmPassword: '',
      healthPackages: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "healthPackages",
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      const u = storedUser ? JSON.parse(storedUser) : null;
      setUser(u);

      const storedLabs = localStorage.getItem(LABS_KEY);
      const allLabs = storedLabs ? JSON.parse(storedLabs) : initialLabs;
      
      if (!storedLabs) {
        localStorage.setItem(LABS_KEY, JSON.stringify(initialLabs));
      }

      const labData = allLabs.find((d: any) => d.id === u?.id);
      
      if (labData) {
        form.reset({
            ...labData,
            email: u.email,
            phoneNumber: labData.phoneNumber || labData.whatsappNumber,
            healthPackages: labData.healthPackages?.map((pkg: any) => ({
                ...pkg,
                tests: Array.isArray(pkg.tests) ? pkg.tests.join(', ') : pkg.tests
            })) || []
        });
         setOriginalPhone(labData.phoneNumber || labData.whatsappNumber);
      }
       if (u) {
        form.setValue('referralCode', u.referralCode);
      }
      setIsLoading(false);
    }
  }, [form]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, fieldName: 'image' | 'registrationCertificate') => {
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

  const onSubmit = (data: ProfileFormValues) => {
    if (!user?.id) return;
    
    if (!isRegistrationNumberUnique('lab', data.registrationNumber, user.id)) {
        form.setError('registrationNumber', { type: 'manual', message: 'This registration number is already in use.' });
        return;
    }
    if (data.phoneNumber !== originalPhone && !isPhoneUnique(data.phoneNumber, user.id)) {
        form.setError('phoneNumber', { type: 'manual', message: 'This phone number is already in use.' });
        return;
    }

    if (data.phoneNumber !== originalPhone) {
      if (!isVerifyingPhone) {
        setIsVerifyingPhone(true);
        toast({ title: 'Verify New Phone Number', description: `An OTP has been sent to ${data.phoneNumber}. Please enter it to confirm the change. (Demo OTP: 123456)` });
        return;
      }
      
      if (data.otp !== '123456') {
        form.setError('otp', { type: 'manual', message: 'Invalid OTP.' });
        return;
      }
    }

    const storedLabs = localStorage.getItem(LABS_KEY);
    const allLabs = storedLabs ? JSON.parse(storedLabs) : initialLabs;
    
    const formattedData = {
        ...data,
        healthPackages: data.healthPackages?.map(pkg => ({
            ...pkg,
            id: pkg.id || `pkg${Date.now()}`,
            tests: pkg.tests.split(',').map(t => t.trim())
        }))
    };

    const updatedLabs = allLabs.map((p: any) => {
        if (p.id === user.id) {
            const newPassword = data.password ? data.password : p.password;
            return { ...p, ...formattedData, password: newPassword, otp: undefined };
        }
        return p;
    });

    localStorage.setItem(LABS_KEY, JSON.stringify(updatedLabs));
    
    const updatedUser = { ...user, fullName: data.name, phone: data.phoneNumber, email: data.email };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    setOriginalPhone(data.phoneNumber);
    setIsVerifyingPhone(false);
    form.setValue('otp', '');
    form.setValue('password', '');
    form.setValue('confirmPassword', '');
    form.clearErrors(['otp', 'password', 'confirmPassword']);

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
  const currentCertificate = form.watch('registrationCertificate');
  const regNumberIsSet = !!form.getValues('registrationNumber');
  const homeCollectionEnabled = form.watch('homeCollectionEnabled');

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
                                    onChange={(e) => handleImageUpload(e, 'image')}
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

                <FormField control={form.control} name="email" render={({ field }) => (
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
                 <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                    <FormItem>
                        <FormLabel>WhatsApp Contact Number</FormLabel>
                        <FormControl>
                            <div className="relative">
                                 <Input type="tel" placeholder="e.g., 919876543210" {...field} className="pl-8"/>
                                 <Phone className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                        </FormControl>
                         <FormMessage />
                    </FormItem>
                )} />

                 {isVerifyingPhone && (
                    <FormField control={form.control} name="otp" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Enter OTP</FormLabel>
                            <FormControl>
                                <Input placeholder="6-digit OTP" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                )}

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
                                <Input type="number" placeholder="e.g. 20" {...field} className="pl-8" min="20" />
                                <Percent className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                        </FormControl>
                        <p className="text-sm text-muted-foreground">Minimum 20%. This is the discount patients get when they redeem Health Points at your lab.</p>
                        <FormMessage />
                    </FormItem>
                )} />
                
                <div className="space-y-4 p-4 border rounded-md bg-slate-50">
                    <h3 className="font-semibold text-base flex items-center gap-2"><Truck/> Home Sample Collection</h3>
                     <FormField
                        control={form.control}
                        name="homeCollectionEnabled"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Enable Home Collection</FormLabel>
                                <FormDescription>
                                Offer sample collection at patient's home.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            </FormItem>
                        )}
                    />
                    {homeCollectionEnabled && (
                        <FormField
                            control={form.control}
                            name="collectionRadius"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Collection Radius (in km)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 5" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                 <div className="space-y-4 p-4 border rounded-md bg-slate-50">
                    <h3 className="font-semibold text-base flex items-center gap-2"><Calendar /> Business Hours</h3>
                     <FormField
                        control={form.control}
                        name="days"
                        render={() => (
                            <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">Operating Days</FormLabel>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {daysOfWeek.map((day) => (
                                <FormField
                                    key={day}
                                    control={form.control}
                                    name="days"
                                    render={({ field }) => {
                                    return (
                                        <FormItem
                                        key={day}
                                        className="flex flex-row items-center space-x-3 space-y-0"
                                        >
                                        <FormControl>
                                            <Checkbox
                                            checked={field.value?.includes(day)}
                                            onCheckedChange={(checked) => {
                                                return checked
                                                ? field.onChange([...(field.value || []), day])
                                                : field.onChange(field.value?.filter((value) => value !== day)
                                                )
                                            }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">{day}</FormLabel>
                                        </FormItem>
                                    )
                                    }}
                                />
                                ))}
                            </div>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField control={form.control} name="hours" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Operating Hours</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input placeholder="e.g., 8:00 AM - 8:00 PM" {...field} className="pl-8"/>
                                    <Clock className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                 <div className="space-y-4 p-4 border rounded-md bg-slate-50">
                    <h3 className="font-semibold text-base flex items-center gap-2"><Beaker/> Health Checkup Packages</h3>
                    <FormDescription>
                        Add predefined health checkup packages that will be displayed on your public profile.
                    </FormDescription>
                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="p-4 border rounded-md relative space-y-3">
                                <FormField control={form.control} name={`healthPackages.${index}.name`} render={({ field }) => (
                                    <FormItem><FormLabel>Package Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`healthPackages.${index}.price`} render={({ field }) => (
                                    <FormItem><FormLabel>Price (INR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`healthPackages.${index}.description`} render={({ field }) => (
                                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`healthPackages.${index}.tests`} render={({ field }) => (
                                    <FormItem><FormLabel>Tests Included</FormLabel><FormControl><Textarea {...field} /></FormControl><FormDescription>Enter comma-separated test names.</FormDescription><FormMessage /></FormItem>
                                )} />
                                <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                     <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ name: '', price: 0, description: '', tests: '' })}
                        className="mt-2"
                        >
                        <PlusCircle className="mr-2"/> Add Package
                    </Button>
                </div>
                
                 <div className="space-y-4 p-4 border rounded-md bg-slate-50">
                    <h3 className="font-semibold text-base flex items-center gap-2"><KeyRound/> Security</h3>
                    <p className="text-sm text-muted-foreground">Set a password for your account for an alternative way to sign in.</p>
                     <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl><Input type="password" placeholder="Leave blank to keep unchanged" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl><Input type="password" placeholder="Confirm your new password" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                 <div className="space-y-4 p-4 border rounded-md bg-slate-50">
                    <h3 className="font-semibold text-base flex items-center gap-2"><BadgeCheck/> Verification Details</h3>
                    <p className="text-sm text-muted-foreground">This information is required for admin approval and is not displayed publicly. Once saved, it cannot be changed.</p>
                    <FormField
                        control={form.control}
                        name="registrationNumber"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Lab Registration Number</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your official registration number" {...field} disabled={regNumberIsSet} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField control={form.control} name="registrationCertificate" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Registration Certificate</FormLabel>
                            <FormControl>
                                <div>
                                    <Input 
                                        id="cert-upload-lab"
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={(e) => handleImageUpload(e, 'registrationCertificate')}
                                        className="hidden" 
                                        disabled={regNumberIsSet}
                                    />
                                    <label htmlFor="cert-upload-lab" className={cn("cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 w-full", regNumberIsSet && "cursor-not-allowed opacity-50")}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        {currentCertificate ? 'Change File' : 'Upload File'}
                                    </label>
                                </div>
                            </FormControl>
                            {currentCertificate && <div className="text-xs text-muted-foreground flex items-center gap-2 mt-2"><FileText className="w-4 h-4"/> <span>{form.getValues('registrationNumber') || 'Certificate'}.jpg</span></div>}
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? <Loader2 className="animate-spin mr-2" /> : 'Save Changes'}
                </Button>
            </div>
        </form>
    </Form>
  );
}
