
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember, type TeamMember } from '@/lib/team-members';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlusCircle, Edit, Trash2, Upload, Loader2 } from 'lucide-react';

const memberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required.'),
  title: z.string().min(1, 'Title is required.'),
  bio: z.string().min(1, 'Bio is required.'),
  image: z.string().min(1, 'An image is required.'),
  dataAiHint: z.string().optional(),
});

type TeamMemberFormValues = z.infer<typeof memberSchema>;

export default function TeamManagementPage() {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
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
    },
  });

  useEffect(() => {
    setMembers(getTeamMembers());
  }, []);
  
   useEffect(() => {
      if(editingMember) {
          form.reset(editingMember);
      } else {
          form.reset({
            id: '',
            name: '',
            title: '',
            bio: '',
            image: '',
            dataAiHint: 'portrait'
          });
      }
  }, [editingMember, form]);

  const handleFormSubmit = (data: TeamMemberFormValues) => {
    if (editingMember) {
      updateTeamMember({ ...data, id: editingMember.id });
      toast({ title: 'Member Updated', description: `${data.name}'s details have been saved.` });
    } else {
      addTeamMember(data);
      toast({ title: 'Member Added', description: `${data.name} has been added to the team.` });
    }
    setMembers(getTeamMembers());
    setIsDialogOpen(false);
    setEditingMember(null);
  };
  
  const handleEditClick = (member: TeamMember) => {
    setEditingMember(member);
    setIsDialogOpen(true);
  };
  
  const handleDeleteClick = (memberId: string) => {
    deleteTeamMember(memberId);
    setMembers(getTeamMembers());
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
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-headline font-bold">Manage Team</h1>
            <p className="text-muted-foreground">Add, edit, or remove members from the "About Us" page.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
            setIsDialogOpen(isOpen);
            if (!isOpen) setEditingMember(null);
        }}>
            <DialogTrigger asChild>
                <Button onClick={() => { setEditingMember(null); setIsDialogOpen(true); }}>
                    <PlusCircle className="mr-2" /> Add Member
                </Button>
            </DialogTrigger>
            <DialogContent>
                 <DialogHeader>
                    <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
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
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Title / Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="bio" render={({ field }) => (
                            <FormItem><FormLabel>Bio</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <DialogFooter>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <Card key={member.id} className="flex flex-col">
            <CardHeader className="flex-row gap-4 items-center">
                <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-primary/20">
                    <Image src={member.image} alt={member.name} fill className="object-cover" />
                </div>
                <div>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.title}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
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
    </div>
  );
}
