
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
import { PlusCircle, Edit, Trash2, User } from 'lucide-react';
import { mockFamilyMembers } from '@/lib/family-members';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';

const FAMILY_KEY = 'familyMembers';

const memberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required.'),
  relationship: z.string().min(1, 'Relationship is required.'),
  age: z.coerce.number().positive('Age must be a positive number.').int(),
});

type FamilyMemberFormValues = z.infer<typeof memberSchema>;

export function FamilyManager() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberFormValues[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMemberFormValues | null>(null);

  useEffect(() => {
    setIsClient(true);
    const storedFamily = sessionStorage.getItem(FAMILY_KEY);
    if (storedFamily) {
      setFamilyMembers(JSON.parse(storedFamily));
    } else {
      sessionStorage.setItem(FAMILY_KEY, JSON.stringify(mockFamilyMembers));
      setFamilyMembers(mockFamilyMembers);
    }
  }, []);

  const form = useForm<FamilyMemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      id: '',
      name: '',
      relationship: '',
      age: 0,
    },
  });
  
  useEffect(() => {
      if(editingMember) {
          form.reset(editingMember);
      } else {
          form.reset({
            id: '',
            name: '',
            relationship: '',
            age: 0,
          });
      }
  }, [editingMember, form]);


  const onSubmit = (data: FamilyMemberFormValues) => {
    let updatedFamily;
    if (editingMember) {
      updatedFamily = familyMembers.map(m => m.id === editingMember.id ? { ...m, ...data } : m);
       toast({
        title: 'Member Updated!',
        description: `${data.name}'s details have been saved.`,
      });
    } else {
      const newMember = { ...data, id: `family${Date.now()}` };
      updatedFamily = [...familyMembers, newMember];
       toast({
        title: 'Member Added!',
        description: `${data.name} has been added to your family list.`,
      });
    }

    setFamilyMembers(updatedFamily);
    sessionStorage.setItem(FAMILY_KEY, JSON.stringify(updatedFamily));
    setEditingMember(null);
    setIsDialogOpen(false);
  };
  
  const handleEdit = (member: FamilyMemberFormValues) => {
    setEditingMember(member);
    setIsDialogOpen(true);
  }

  const handleDelete = (memberId: string) => {
      const updatedFamily = familyMembers.filter(m => m.id !== memberId);
      setFamilyMembers(updatedFamily);
      sessionStorage.setItem(FAMILY_KEY, JSON.stringify(updatedFamily));
      toast({
        title: 'Member Removed',
        description: 'The family member has been removed.',
        variant: 'destructive'
      });
  }

  return (
    <div className="space-y-4">
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
            setIsDialogOpen(isOpen);
            if (!isOpen) {
                setEditingMember(null);
            }
        }}>
            <DialogTrigger asChild>
                <Button onClick={() => { setEditingMember(null); setIsDialogOpen(true); }} className="w-full">
                    <PlusCircle className="mr-2" />
                    Add Family Member
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingMember ? 'Edit Family Member' : 'Add New Family Member'}</DialogTitle>
                    <DialogDescription>
                        {editingMember ? 'Update the details below.' : 'Fill in the details for your new family member.'}
                    </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="relationship" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Relationship</FormLabel>
                                <FormControl><Input placeholder="e.g., Spouse, Child" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="age" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl><Input type="number" placeholder="e.g., 34" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter className="pt-4">
                            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                            <Button type="submit">{editingMember ? 'Save Changes' : 'Add Member'}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

        <Separator />

        <div className="space-y-3">
             {isClient && familyMembers.length > 0 ? familyMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${member.name}`} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.relationship}, {member.age} years</p>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(member)}><Edit className="w-4 h-4"/></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id!)}><Trash2 className="w-4 h-4 text-destructive"/></Button>
                    </div>
                </div>
            )) : (
                <p className="text-muted-foreground text-center py-4 text-sm">No family members added yet.</p>
            )}
        </div>
    </div>
  );
}
