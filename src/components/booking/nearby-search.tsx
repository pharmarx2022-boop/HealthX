

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Stethoscope, MapPin, Pill, Loader2, AlertTriangle, Building, Link as LinkIcon, Search, PercentCircle, Beaker, Calendar, Star, Briefcase, Filter, Clock, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { getOpeningStatus } from '@/lib/utils';

const BookingDialog = dynamic(() => import('./booking-dialog').then(mod => mod.BookingDialog), {
    ssr: false
});


// Types
type Doctor = any;
type Clinic = any;
type Pharmacy = any;
type Lab = any;

interface NearbySearchProps {
    allowedServices?: ('doctor' | 'pharmacy' | 'lab')[];
}


export function NearbySearch({ allowedServices = ['doctor', 'pharmacy', 'lab'] }: NearbySearchProps) {
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [user, setUser] = useState<any | null>(null);
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const { toast } = useToast();

  // Filter state
  const [specialty, setSpecialty] = useState('All');
  const [experience, setExperience] = useState(0);
  const [feeRange, setFeeRange] = useState('All');
  const [distance, setDistance] = useState(10);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

   useEffect(() => {
    // In a real app, these would be API calls.
    // We are setting them to empty arrays to represent a clean state.
    setDoctors([]);
    setClinics([]);
    setPharmacies([]);
    setLabs([]);
    setFamilyMembers([]);

    const storedUser = sessionStorage.getItem('user');
    setUser(storedUser ? JSON.parse(storedUser) : null);
      
    handleLocationRequest();
  }, []);

  const handleLocationRequest = () => {
     if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        setStatus('loading');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
                // In a real app, you would now fetch data from your API based on this location
                setStatus('success');
            },
            (err) => {
                setError(`Location access denied. Please enable it in your browser settings to find nearby services.`);
                setStatus('error');
            }
        );
    } else {
        setError('Geolocation is not supported by your browser.');
        setStatus('error');
    }
  }

  const getDoctorFeeRange = (doctorId: string) => {
    const doctorClinics = clinics.filter(c => c.doctorId === doctorId);
    if (doctorClinics.length === 0) return { range: 'N/A', min: 0 };
    
    const fees = doctorClinics.map(c => c.consultationFee);
    const minFee = Math.min(...fees);
    const maxFee = Math.max(...fees);

    if (minFee === maxFee) {
        return { range: `INR ${minFee.toFixed(2)}`, min: minFee };
    }
    return { range: `INR ${minFee.toFixed(2)} - INR ${maxFee.toFixed(2)}`, min: minFee };
  };

  const specialties = useMemo(() => {
    const allSpecialties = doctors.map(d => d.specialty);
    return ['All', ...Array.from(new Set(allSpecialties))];
  }, [doctors]);

  const searchResults = useMemo(() => {
    // This logic would be handled by your backend API in a real app.
    // For the UI, we just return the empty arrays.
    return { doctors: [], pharmacies: [], labs: [] };
  }, [searchTerm, doctors, clinics, pharmacies, labs, specialty, experience, feeRange, distance, allowedServices]);
  
  const handleBookNow = (e: React.MouseEvent, doctor: Doctor) => {
    e.preventDefault();
    // Logic to open booking dialog, which needs to be adapted for real data
    toast({title: "Action Required", description: "Booking dialog needs to be connected to live data."})
  };
  
  const handleBookingConfirm = () => {
    // This would be called by the BookingDialog on successful booking
    toast({
        title: "Action Required",
        description: "Booking confirmation needs to be sent to the backend.",
    });
    setIsBookingOpen(false);
    setSelectedDoctor(null);
  };
  
  const getAverageRating = (reviewsList: any[] | undefined) => {
    if (!reviewsList || reviewsList.length === 0) return 'N/A';
    const totalRating = reviewsList.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviewsList.length).toFixed(1);
  };

  const renderFilterControls = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
            <Label htmlFor="specialty">Specialty</Label>
            <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger id="specialty">
                    <SelectValue placeholder="All Specialties"/>
                </SelectTrigger>
                <SelectContent>
                    {specialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label htmlFor="experience">Min. Experience: {experience} years</Label>
            <Slider id="experience" value={[experience]} onValueChange={(val) => setExperience(val[0])} max={30} step={1}/>
        </div>
        <div className="space-y-2">
            <Label htmlFor="fee">Consultation Fee</Label>
            <Select value={feeRange} onValueChange={setFeeRange}>
                <SelectTrigger id="fee">
                    <SelectValue placeholder="Any"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="0-500">Under INR 500</SelectItem>
                    <SelectItem value="500-1000">INR 500 - 1000</SelectItem>
                    <SelectItem value="1000-1500">INR 1000 - 1500</SelectItem>
                    <SelectItem value="1500">Over INR 1500</SelectItem>
                </SelectContent>
            </Select>
        </div>
            <div className="space-y-2">
            <Label htmlFor="distance">Distance: {distance} km</Label>
            <Slider id="distance" value={[distance]} onValueChange={(val) => setDistance(val[0])} max={500} step={1}/>
        </div>
    </div>
  );


  const renderContent = () => {
    switch(status) {
        case 'loading':
            return (
                <div className="text-center text-muted-foreground py-12">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4"/>
                    <p>Finding services near you...</p>
                </div>
            )
        case 'error':
            return (
                <div className="text-center text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg p-8">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-destructive"/>
                    <p className="font-semibold">{error}</p>
                </div>
            )
        case 'success':
            const { doctors, pharmacies, labs } = searchResults;
            const noResults = doctors.length === 0 && pharmacies.length === 0 && labs.length === 0;
            return (
                <div className="space-y-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                            placeholder="Search by doctor, specialty, pharmacy, lab..."
                            className="pl-10 text-base py-6"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                     <div className="hidden md:block">
                        <Card className="shadow-sm bg-slate-50/70">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Filter/> Filter Doctors</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {renderFilterControls()}
                            </CardContent>
                        </Card>
                     </div>
                      <div className="block md:hidden">
                        <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <Filter className="mr-2"/> Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom">
                                <SheetHeader>
                                    <SheetTitle>Filter Doctors</SheetTitle>
                                </SheetHeader>
                                <div className="p-4 space-y-6">
                                    {renderFilterControls()}
                                    <Button onClick={() => setIsFilterSheetOpen(false)} className="w-full">Apply Filters</Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                     </div>
                    {noResults && (
                        <div className="text-center py-16 text-muted-foreground">
                            <p>No services found matching your search.</p>
                            <p className="text-sm">Try broadening your search criteria.</p>
                        </div>
                     )}
                </div>
            )
        default:
            return null;
    }
  }

  return (
    <div className="space-y-8">
        {renderContent()}
    </div>
  );
}
