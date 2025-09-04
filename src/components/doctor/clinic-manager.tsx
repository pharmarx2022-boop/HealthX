
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog"
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { PlusCircle, Edit, Trash2, MapPin, Calendar, Clock, Upload, X, ChevronsUpDown, Check, IndianRupee, Link as LinkIcon } from 'lucide-react';
import { initialClinics } from '@/lib/mock-data';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const CLINICS_KEY = 'mockClinics';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

const clinicSchema = z.object({
  id: z.string().optional(),
  doctorId: z.string(),
  name: z.string().min(1, 'Clinic name is required.'),
  location: z.string().min(1, 'Location is required.'),
  image: z.string().min(1, 'A clinic picture is required.'),
  dataAiHint: z.string().optional(),
  consultationFee: z.coerce.number().positive('Fee must be a positive number.'),
  days: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one day.',
  }),
  slots: z.string().min(1, 'Please enter at least one time slot.'),
});

type ClinicFormValues = z.infer<typeof clinicSchema>;

export function ClinicManager() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [clinics, setClinics] = useState<ClinicFormValues[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<ClinicFormValues | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      setUser(user);

      const storedClinics = sessionStorage.getItem(CLINICS_KEY);
      if (storedClinics) {
        setClinics(JSON.parse(storedClinics));
      } else {
        sessionStorage.setItem(CLINICS_KEY, JSON.stringify(initialClinics));
        setClinics(initialClinics);
      }
    }
  }, []);

  const form = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
        id: '',
        doctorId: '',
        name: '',
        location: '',
        image: '',
        dataAiHint: 'clinic interior',
        consultationFee: 0,
        days: [],
        slots: '',
    },
  });
  
  useEffect(() => {
      if(user) {
          form.setValue('doctorId', user.id);
      }
      if(editingClinic) {
          form.reset(editingClinic);
      } else {
          form.reset({
            id: '',
            doctorId: user?.id || '',
            name: '',
            location: '',
            image: '',
            dataAiHint: 'clinic interior',
            consultationFee: 0,
            days: [],
            slots: '',
          });
      }
  }, [editingClinic, user, form]);

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

  const onSubmit = (data: ClinicFormValues) => {
    let updatedClinics;
    if (editingClinic) {
      // Editing existing clinic
      updatedClinics = clinics.map(c => c.id === editingClinic.id ? { ...c, ...data } : c);
       toast({
        title: 'Clinic Updated!',
        description: 'Your clinic details have been saved.',
      });
    } else {
      // Adding new clinic
      const newClinic = { ...data, id: `clinic${Date.now()}` };
      updatedClinics = [...clinics, newClinic];
       toast({
        title: 'Clinic Added!',
        description: 'Your new clinic has been added to your profile.',
      });
    }

    setClinics(updatedClinics);
    sessionStorage.setItem(CLINICS_KEY, JSON.stringify(updatedClinics));
    setEditingClinic(null);
    setIsDialogOpen(false);
  };
  
  const handleEdit = (clinic: ClinicFormValues) => {
    setEditingClinic(clinic);
    setIsDialogOpen(true);
  }

  const handleDelete = (clinicId: string) => {
      const updatedClinics = clinics.filter(c => c.id !== clinicId);
      setClinics(updatedClinics);
      sessionStorage.setItem(CLINICS_KEY, JSON.stringify(updatedClinics));
      toast({
        title: 'Clinic Removed',
        description: 'The clinic has been removed from your profile.',
        variant: 'destructive'
      });
  }

  const userClinics = isClient ? clinics.filter(c => c.doctorId === user?.id) : [];

  const currentImage = form.watch('image');

  return (
    <div className="space-y-8">
        <div className="flex justify-end">
             <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
                 setIsDialogOpen(isOpen);
                 if (!isOpen) {
                     setEditingClinic(null);
                 }
             }}>
                <DialogTrigger asChild>
                    <Button onClick={() => { setEditingClinic(null); setIsDialogOpen(true); }}>
                        <PlusCircle className="mr-2" />
                        Add New Clinic
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingClinic ? 'Edit Clinic' : 'Add New Clinic'}</DialogTitle>
                        <DialogDescription>
                            {editingClinic ? 'Update the details for your clinic below.' : 'Fill in the details for your new clinic below.'}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Clinic Name</FormLabel>
                                    <FormControl><Input placeholder="e.g., Andheri West Clinic" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="location" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location / Address</FormLabel>
                                    <FormControl><Input placeholder="e.g., 123 Health St, Andheri West" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="image" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Clinic Picture</FormLabel>
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
                             
                            {currentImage && (
                                <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden border">
                                    <Image src={currentImage} alt="Clinic preview" fill style={{ objectFit: 'cover' }} />
                                </div>
                            )}

                            <FormField control={form.control} name="consultationFee" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Consultation Fee (₹)</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g., 1500" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            
                            <FormField
                                control={form.control}
                                name="days"
                                render={() => (
                                    <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">Available Days</FormLabel>
                                        <FormDescription>Select the days of the week this clinic is open.</FormDescription>
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

                             <FormField control={form.control} name="slots" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Available Time Slots</FormLabel>
                                    <FormControl><Textarea placeholder="e.g., 10:00 AM, 11:00 AM, 02:00 PM" {...field} /></FormControl>
                                     <FormDescription>Enter comma-separated time slots.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                           
                            <DialogFooter className="sticky bottom-0 bg-background pt-4">
                                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                                <Button type="submit">{editingClinic ? 'Save Changes' : 'Add Clinic'}</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userClinics.length > 0 ? userClinics.map(clinic => (
                <Card key={clinic.id} className="flex flex-col">
                    <CardHeader>
                        <div className="relative w-full h-48 rounded-md overflow-hidden mb-4">
                             <Image src={clinic.image || 'https://picsum.photos/400/300'} alt={clinic.name} fill style={{objectFit:"cover"}} data-ai-hint={clinic.dataAiHint || 'clinic'} />
                        </div>
                        <CardTitle>{clinic.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 pt-1 text-primary">
                            <IndianRupee className="w-4 h-4" />
                            <span className="font-bold">₹{clinic.consultationFee.toFixed(2)}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                             <MapPin className="w-4 h-4 mt-0.5 shrink-0"/>
                             <span>{clinic.location}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                             <Calendar className="w-4 h-4 mt-0.5 shrink-0"/>
                             <span>{clinic.days.join(', ')}</span>
                        </div>
                         <div className="flex items-start gap-2 text-sm text-muted-foreground">
                             <Clock className="w-4 h-4 mt-0.5 shrink-0"/>
                             <span>{clinic.slots}</span>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50/70 p-4 border-t flex justify-end gap-2">
                         <Button variant="outline" size="sm" onClick={() => handleEdit(clinic)}><Edit className="mr-2"/> Edit</Button>

                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm"><Trash2 className="mr-2"/> Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the clinic from your profile.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(clinic.id!)}>Confirm Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </Card>
            )) : (
                <p className="text-muted-foreground col-span-full text-center py-12">You haven't added any clinics yet. Click "Add New Clinic" to get started.</p>
            )}
        </div>
    </div>
  );
}
