
'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Loader2, Upload, Percent } from 'lucide-react';
import { initialLabs } from '@/lib/mock-data';
import { Label } from '@/components/ui/label';

const LABS_KEY = 'mockLabs';

type LabProfile = {
  name: string;
  location: string;
  image: string;
  discount: number;
};

export function LabProfileForm() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [labs, setLabs] = useState(initialLabs);
  
  const [profile, setProfile] = useState<LabProfile>({
    name: '',
    location: '',
    image: '',
    discount: 30,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LabProfile, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const storedLabs = sessionStorage.getItem(LABS_KEY);
      if (!storedLabs) {
        sessionStorage.setItem(LABS_KEY, JSON.stringify(initialLabs));
      } else {
        setLabs(JSON.parse(storedLabs));
      }
    }
  }, []);

  const labData = labs.find(p => p.id === user?.id);

  useEffect(() => {
    if (labData) {
      setProfile({
          name: labData.name,
          location: labData.location,
          image: labData.image,
          discount: labData.discount,
      });
    }
  }, [labData]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: name === 'discount' ? parseFloat(value) || 0 : value }));
    if (errors[name as keyof LabProfile]) {
        setErrors(prev => ({...prev, [name]: undefined}));
    }
  };
  
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({...prev, image: reader.result as string}));
        if (errors.image) {
            setErrors(prev => ({...prev, image: undefined}));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
      const newErrors: Partial<Record<keyof LabProfile, string>> = {};
      if (!profile.name) newErrors.name = 'Lab name is required.';
      if (!profile.location) newErrors.location = 'Location is required.';
      if (!profile.image) newErrors.image = 'A lab picture is required.';
      if (profile.discount < 30) newErrors.discount = 'Discount must be at least 30%.';
      if (profile.discount > 100) newErrors.discount = 'Discount cannot exceed 100%.';
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate() || !labData) return;

    setIsSubmitting(true);
    
    const updatedLabs = labs.map(p => {
        if (p.id === labData.id) {
            return { ...p, ...profile };
        }
        return p;
    });

    sessionStorage.setItem(LABS_KEY, JSON.stringify(updatedLabs));
    setLabs(updatedLabs);

    setTimeout(() => {
        toast({
            title: 'Profile Updated!',
            description: 'Your lab details have been saved successfully.',
        });
        setIsSubmitting(false);
    }, 500); // Simulate network delay
  };
  
  if (!isClient || !labData) {
    return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary"/>
            <p className="ml-4 text-muted-foreground">Loading profile...</p>
        </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <h3 className="font-semibold mb-2">Lab Picture</h3>
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                {profile.image ? (
                    <Image src={profile.image} alt="Lab Preview" fill style={{objectFit:"cover"}} data-ai-hint="lab exterior" />
                ) : (
                    <div className="bg-slate-100 h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                        No Image
                    </div>
                )}
            </div>
            <div className="mt-4">
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
                {errors.image && <p className="text-sm font-medium text-destructive mt-2">{errors.image}</p>}
            </div>
        </div>
        <div className="md:col-span-2 space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Lab Name</Label>
                <Input id="name" name="name" placeholder="e.g., Metropolis Lab" value={profile.name} onChange={handleInputChange} />
                {errors.name && <p className="text-sm font-medium text-destructive mt-2">{errors.name}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="e.g., Near Andheri Station" value={profile.location} onChange={handleInputChange} />
                {errors.location && <p className="text-sm font-medium text-destructive mt-2">{errors.location}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="discount">Health Points Discount</Label>
                <div className="relative">
                    <Input id="discount" name="discount" type="number" placeholder="e.g. 30" value={profile.discount} onChange={handleInputChange} className="pl-8" min="30" />
                    <Percent className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Minimum 30%. This is the discount patients get when they redeem Health Points at your lab.</p>
                {errors.discount && <p className="text-sm font-medium text-destructive mt-2">{errors.discount}</p>}
            </div>
            
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="animate-spin mr-2" />}
                Save Changes
            </Button>
        </div>
    </form>
  );
}
