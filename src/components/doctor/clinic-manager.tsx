
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
import { PlusCircle, Edit, Trash2, MapPin, Calendar, Clock, Upload, X, ChevronsUpDown, Check, IndianRupee, Link as LinkIcon, Pill, FlaskConical } from 'lucide-react';
import { initialClinics, mockPharmacies, mockLabs } from '@/lib/mock-data';
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
  associatedPharmacyIds: z.array(z.string()).optional(),
  associatedLabIds: z.array(z.string()).optional(),
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
        associatedPharmacyIds: [],
        associatedLabIds: [],
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
            associatedPharmacyIds: [],
            associatedLabIds: [],
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

                            <FormField
                                control={form.control}
                                name="associatedPharmacyIds"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Associated Pharmacies</FormLabel>
                                    <MultiSelect
                                        options={mockPharmacies.map(p => ({ value: p.id, label: p.name }))}
                                        selected={field.value ?? []}
                                        onChange={field.onChange}
                                        placeholder="Select pharmacies..."
                                    />
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="associatedLabIds"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Associated Labs</FormLabel>
                                    <MultiSelect
                                        options={mockLabs.map(l => ({ value: l.id, label: l.name }))}
                                        selected={field.value ?? []}
                                        onChange={field.onChange}
                                        placeholder="Select labs..."
                                    />
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                           
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
                        <CardDescription className="flex items-center gap-2 pt-1">
                            <MapPin className="w-4 h-4" />
                            {clinic.location}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <div className="flex items-start gap-2">
                             <IndianRupee className="w-4 h-4 mt-1 text-primary"/>
                             <div>
                                <h4 className="font-semibold">Consultation Fee</h4>
                                <p className="text-sm text-muted-foreground">₹{clinic.consultationFee.toFixed(2)}</p>
                             </div>
                        </div>
                        <div className="flex items-start gap-2">
                             <Calendar className="w-4 h-4 mt-1 text-primary"/>
                             <div>
                                <h4 className="font-semibold">Available Days</h4>
                                <p className="text-sm text-muted-foreground">{clinic.days.join(', ')}</p>
                             </div>
                        </div>
                         <div className="flex items-start gap-2">
                             <Clock className="w-4 h-4 mt-1 text-primary"/>
                             <div>
                                <h4 className="font-semibold">Available Slots</h4>
                                <p className="text-sm text-muted-foreground">{clinic.slots}</p>
                             </div>
                        </div>
                         {(clinic.associatedPharmacyIds?.length || 0) > 0 || (clinic.associatedLabIds?.length || 0) > 0 ? (
                            <div className="flex items-start gap-2">
                                <LinkIcon className="w-4 h-4 mt-1 text-primary"/>
                                <div>
                                    <h4 className="font-semibold">Associations</h4>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {clinic.associatedPharmacyIds?.map(id => {
                                            const pharmacy = mockPharmacies.find(p => p.id === id);
                                            return pharmacy ? <Badge key={id} variant="secondary" className="bg-emerald-100 text-emerald-800"><Pill className="w-3 h-3 mr-1"/>{pharmacy.name}</Badge> : null;
                                        })}
                                        {clinic.associatedLabIds?.map(id => {
                                            const lab = mockLabs.find(l => l.id === id);
                                            return lab ? <Badge key={id} variant="secondary" className="bg-sky-100 text-sky-800"><FlaskConical className="w-3 h-3 mr-1"/>{lab.name}</Badge> : null;
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : null}
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
                                    </                               AlertDialogDescription>
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

// MultiSelect Component
interface MultiSelectProps {
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  placeholder?: string;
}

function MultiSelect({ options, selected, onChange, className, placeholder = "Select..." }: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-auto", className)}
          onClick={() => setOpen(!open)}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length > 0 ? (
              options
                .filter((option) => selected.includes(option.value))
                .map((option) => (
                  <Badge
                    variant="secondary"
                    key={option.value}
                    className="mr-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnselect(option.value);
                    }}
                  >
                    {option.label}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))
            ) : (
              <span className="text-muted-foreground font-normal">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  onChange(
                    selected.includes(option.value)
                      ? selected.filter((item) => item !== option.value)
                      : [...selected, option.value]
                  );
                  setOpen(true);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected.includes(option.value) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
