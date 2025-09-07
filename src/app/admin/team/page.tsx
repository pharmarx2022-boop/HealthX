
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember, type TeamMember, teamMemberCategories } from '@/lib/team-members';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlusCircle, Edit, Trash2, Upload, Loader2, Link as LinkIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const memberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required.'),
  category: z.enum(teamMemberCategories, { required_error: "A category is required." }),
  title: z.string().min(1, 'Title is required.'),
  bio: z.string().min(1, 'Bio is required.'),
  image: z.string().min(1, 'An image is required.'),
  dataAiHint: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
});

type TeamMemberFormValues = z.infer<typeof memberSchema>;

export default function TeamManagementPage() {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: '',
      title: '',
      bio: '',
      image: '',
      dataAiHint: 'portrait',
      linkedin: '',
      twitter: '',
      instagram: ''
    },
  });
  
  const fetchTeam = async () => {
      setIsLoading(true);
      const team = await getTeamMembers();
      setMembers(team);
      setIsLoading(false);
  };

  useEffect(() => {
    fetchTeam();
  }, []);
  
   useEffect(() => {
      if(editingMember) {
          form.reset(editingMember);
      } else {
          form.reset({
            id: '',
            name: '',
            category: undefined,
            title: '',
            bio: '',
            image: '',
            dataAiHint: 'portrait',
            linkedin: '',
            twitter: '',
            instagram: ''
          });
      }
  }, [editingMember, form]);

  const handleFormSubmit = async (data: TeamMemberFormValues) => {
    if (editingMember) {
      await updateTeamMember({ ...data, id: editingMember.id });
      toast({ title: 'Member Updated', description: `${data.name}'s details have been saved.` });
    } else {
      await addTeamMember(data);
      toast({ title: 'Member Added', description: `${data.name} has been added to the team.` });
    }
    fetchTeam();
    setIsDialogOpen(false);
    setEditingMember(null);
  };
  
  const handleEditClick = (member: TeamMember) => {
    setEditingMember(member);
    setIsDialogOpen(true);
  };
  
  const handleDeleteClick = async (memberId: string) => {
    await deleteTeamMember(memberId);
    fetchTeam();
    toast({ title: 'Member Removed', variant: 'destructive' });
  };
  
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
  
  const currentImage = form.watch('image');


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-headline font-bold">Manage Team</h1>
            <p className="text-muted-foreground">Add, edit, or remove members from the "About Us" page.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
            setIsDialogOpen(isOpen);
            if (!isOpen) setEditingMember(null);
        }}>
            <DialogTrigger asChild>
                <Button onClick={() => { setEditingMember(null); setIsDialogOpen(true); }} className="w-full sm:w-auto">
                    <PlusCircle className="mr-2" /> Add Member
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                 <DialogHeader>
                    <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                        <FormField control={form.control} name="image" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Photo</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input 
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden" 
                                        />
                                        <label htmlFor="image-upload" className="cursor-pointer">
                                            <div className="relative w-full aspect-video rounded-md border-2 border-dashed flex items-center justify-center text-muted-foreground hover:border-primary transition-colors">
                                                {currentImage ? (
                                                    <Image src={currentImage} alt="Preview" fill className="object-cover rounded-md" />
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
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {teamMemberCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Title / Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="bio" render={({ field }) => (
                            <FormItem><FormLabel>Bio</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <h4 className="font-medium text-sm pt-2">Social Links (Optional)</h4>
                        <FormField control={form.control} name="linkedin" render={({ field }) => (
                            <FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input type="url" placeholder="https://linkedin.com/in/..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="twitter" render={({ field }) => (
                            <FormItem><FormLabel>X (Twitter) URL</FormLabel><FormControl><Input type="url" placeholder="https://x.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="instagram" render={({ field }) => (
                            <FormItem><FormLabel>Instagram URL</FormLabel><FormControl><Input type="url" placeholder="https://instagram.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <DialogFooter className="sticky bottom-0 bg-background pt-4">
                            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="animate-spin mr-2"/>}
                                {editingMember ? 'Save Changes' : 'Add Member'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {Array.from({length: 3}).map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-4">
                        <Skeleton className="w-20 h-20 rounded-full"/>
                        <div className="flex-grow space-y-2">
                             <Skeleton className="h-6 w-3/4"/>
                             <Skeleton className="h-4 w-1/2"/>
                        </div>
                    </CardHeader>
                    <CardContent><Skeleton className="h-10 w-full"/></CardContent>
                    <CardFooter className="bg-slate-50/70 p-2 border-t flex justify-end gap-2">
                         <Skeleton className="h-8 w-20"/>
                         <Skeleton className="h-8 w-20"/>
                    </CardFooter>
                </Card>
             ))}
         </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <Card key={member.id} className="flex flex-col">
                <CardHeader className="flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-primary/20">
                        <Image src={member.image} alt={member.name} fill className="object-cover" />
                    </div>
                    <div className="flex-grow">
                        <CardTitle>{member.name}</CardTitle>
                        <CardDescription>{member.title} ({member.category})</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow text-center sm:text-left">
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
                <CardFooter className="bg-slate-50/70 p-2 border-t flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(member)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" /> Delete</Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action will permanently delete {member.name} from the team page.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteClick(member.id)}>Confirm</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
      )}
    </div>
  );
}
