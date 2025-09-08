

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
import { initialDoctors, initialClinics, initialPharmacies, initialLabs } from '@/lib/mock-data';
import { mockFamilyMembers } from '@/lib/family-members';

const BookingDialog = dynamic(() => import('./booking-dialog').then(mod => mod.BookingDialog), {
    ssr: false
});


// Types
type Doctor = typeof initialDoctors[0];
type Clinic = typeof initialClinics[0];
type Pharmacy = typeof initialPharmacies[0];
type Lab = typeof initialLabs[0];

interface NearbySearchProps {
    allowedServices?: ('doctor' | 'pharmacy' | 'lab')[];
}


export function NearbySearch({ allowedServices = ['doctor', 'pharmacy', 'lab'] }: NearbySearchProps) {
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [familyMembers, setFamilyMembers] = useState(mockFamilyMembers);
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
    if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        setUser(storedUser ? JSON.parse(storedUser) : null);
        
        const storedDoctors = localStorage.getItem('doctorsData');
        setDoctors(storedDoctors ? JSON.parse(storedDoctors) : initialDoctors);

        const storedClinics = localStorage.getItem('mockClinics');
        setClinics(storedClinics ? JSON.parse(storedClinics) : initialClinics);

        const storedPharmacies = localStorage.getItem('mockPharmacies');
        setPharmacies(storedPharmacies ? JSON.parse(storedPharmacies) : initialPharmacies);

        const storedLabs = localStorage.getItem('mockLabs');
        setLabs(storedLabs ? JSON.parse(storedLabs) : initialLabs);
        
        const storedFamily = localStorage.getItem('familyMembers');
        setFamilyMembers(storedFamily ? JSON.parse(storedFamily) : mockFamilyMembers);
    }
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
    const term = searchTerm.toLowerCase();

    const filteredDoctors = doctors.filter(doctor => {
        const fee = getDoctorFeeRange(doctor.id).min;
        const feeFilter = feeRange === 'All'
            || (feeRange === '0-500' && fee < 500)
            || (feeRange === '500-1000' && fee >= 500 && fee <= 1000)
            || (feeRange === '1000-1500' && fee > 1000 && fee <= 1500)
            || (feeRange === '1500' && fee > 1500);

        return (
            (doctor.name.toLowerCase().includes(term) || doctor.specialty.toLowerCase().includes(term)) &&
            (specialty === 'All' || doctor.specialty === specialty) &&
            (doctor.experience >= experience) &&
            feeFilter
        );
    });

    const filteredPharmacies = pharmacies.filter(p => p.name.toLowerCase().includes(term));
    const filteredLabs = labs.filter(l => l.name.toLowerCase().includes(term));
    
    return {
        doctors: allowedServices.includes('doctor') ? filteredDoctors : [],
        pharmacies: allowedServices.includes('pharmacy') ? filteredPharmacies : [],
        labs: allowedServices.includes('lab') ? filteredLabs : []
    };
  }, [searchTerm, doctors, clinics, pharmacies, labs, specialty, experience, feeRange, allowedServices]);
  
  const handleBookNow = (e: React.MouseEvent, doctor: Doctor) => {
    e.preventDefault();
    setSelectedDoctor(doctor);
    setIsBookingOpen(true);
  };
  
  const handleBookingConfirm = (patientId: string, clinicId: string, date: Date, time: string, transactionId: string) => {
    const clinic = clinics.find(c => c.id === clinicId);
    if (!selectedDoctor || !clinic) return;

    let patientName = "Yourself";
    if(patientId !== 'self') {
        const member = mockFamilyMembers.find(m => m.id === patientId);
        if(member) patientName = member.name;
    }

    const newAppointment = {
        id: `appt_${Date.now()}`,
        transactionId,
        patientId,
        name: patientName,
        clinic: clinic.name,
        clinicId: clinic.id,
        doctorId: selectedDoctor.id,
        healthCoordinatorId: user?.role === 'health-coordinator' ? user.id : null,
        appointmentDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(time.split(':')[0]), parseInt(time.split(':')[1].split(' ')[0])).toISOString(),
        status: 'upcoming',
        consultation: 'General Consultation',
        notes: '',
        consultationFee: clinic.consultationFee,
        refundStatus: 'Not Refunded',
        nextAppointmentDate: null,
        reviewed: false
    };

    const allPatients = JSON.parse(localStorage.getItem('mockPatients') || '[]');
    const updatedPatients = [...allPatients, newAppointment];
    localStorage.setItem('mockPatients', JSON.stringify(updatedPatients));
    
    const toastDescription = `Your appointment at ${clinic.name} is booked. Remember to pay INR ${clinic.consultationFee.toFixed(2)} in cash at the clinic. Your online deposit is secure and will be refunded after your visit.`;

    toast({
        title: "Booking Confirmed!",
        description: toastDescription,
        duration: 9000,
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );


  const renderContent = () => {
    switch(status) {
        case 'idle':
            return (
                <Card className="text-center p-8">
                    <CardHeader>
                        <MapPin className="w-12 h-12 mx-auto text-primary"/>
                        <CardTitle>Find Services Near You</CardTitle>
                        <CardDescription>
                            We need your location to show you doctors, labs, and pharmacies in your area.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleLocationRequest}>Use My Current Location</Button>
                    </CardContent>
                </Card>
            )
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
                    <Button variant="destructive" className="mt-4" onClick={handleLocationRequest}>Try Again</Button>
                </div>
            )
        case 'success':
            const { doctors: filteredDoctors, pharmacies: filteredPharmacies, labs: filteredLabs } = searchResults;
            const noResults = filteredDoctors.length === 0 && filteredPharmacies.length === 0 && filteredLabs.length === 0;
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
                     {allowedServices.includes('doctor') && (
                        <>
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
                        </>
                     )}
                    {noResults && (
                        <div className="text-center py-16 text-muted-foreground">
                            <p>No services found matching your search.</p>
                            <p className="text-sm">Try broadening your search criteria.</p>
                        </div>
                     )}

                    {filteredDoctors.length > 0 && (
                         <div className="space-y-4">
                            <h2 className="text-2xl font-bold font-headline flex items-center gap-2"><Stethoscope/> Doctors</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredDoctors.map(doctor => (
                                    <Link key={doctor.id} href={`/doctor/${doctor.id}`} passHref>
                                        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                                            <CardHeader>
                                                <div className="flex flex-col sm:flex-row gap-4 items-start">
                                                    <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 border-2 border-primary/20">
                                                        <Image src={doctor.image} alt={doctor.name} fill style={{objectFit:"cover"}} data-ai-hint={doctor.dataAiHint} />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <CardTitle>{doctor.name}</CardTitle>
                                                        <CardDescription>{doctor.specialty}</CardDescription>
                                                        <div className="flex items-center gap-2 text-sm mt-1">
                                                            <Briefcase className="w-4 h-4" /> {doctor.experience} years exp.
                                                        </div>
                                                         <div className="flex items-center gap-2 text-sm mt-1 text-amber-600">
                                                            <Star className="w-4 h-4 fill-current" /> {getAverageRating(doctor.reviewsList)} ({doctor.reviewsList?.length || 0} reviews)
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="flex-grow">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <MapPin className="w-4 h-4" /> {doctor.location}
                                                </div>
                                            </CardContent>
                                            <CardFooter className="bg-slate-50/70 p-2 border-t flex-col items-start gap-2">
                                                <div className="text-sm font-bold text-primary px-2">{getDoctorFeeRange(doctor.id).range}</div>
                                                <Button size="sm" className="w-full" onClick={(e) => handleBookNow(e, doctor)}>
                                                    <Calendar className="mr-2" /> Book Now
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                     {(filteredPharmacies.length > 0 || filteredLabs.length > 0) && <Separator />}
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                         {filteredPharmacies.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold font-headline flex items-center gap-2"><Pill/> Pharmacies</h2>
                                <div className="space-y-4">
                                    {filteredPharmacies.map(p => {
                                        const { isOpen, text } = getOpeningStatus(p.days, p.hours);
                                        return (
                                            <Link key={p.id} href={`/pharmacy/${p.id}`} passHref>
                                                <Card className="hover:shadow-lg transition-shadow">
                                                    <CardContent className="p-4 flex gap-4">
                                                        <div className="relative w-24 h-24 rounded-md overflow-hidden shrink-0">
                                                            <Image src={p.image} alt={p.name} fill style={{objectFit:"cover"}} data-ai-hint="pharmacy exterior" />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <div className="flex justify-between items-start">
                                                                <h3 className="font-semibold">{p.name}</h3>
                                                                <Badge variant={isOpen ? "secondary" : "destructive"}>{text}</Badge>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1"><MapPin className="w-4 h-4"/>{p.location}</p>
                                                            <div className="flex items-center gap-2 text-sm mt-1 text-amber-600">
                                                                <Star className="w-4 h-4 fill-current" /> {getAverageRating(p.reviewsList)} ({p.reviewsList?.length || 0} reviews)
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {p.acceptsHealthPoints && <Badge variant="outline" className="text-green-700 border-green-200"><PercentCircle className="mr-1 w-4 h-4"/> Accepts Health Points</Badge>}
                                                                {p.homeDeliveryEnabled && <Badge variant="outline"><Truck className="mr-1 w-4 h-4"/> Home Delivery</Badge>}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                         )}
                         {filteredLabs.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold font-headline flex items-center gap-2"><Beaker/> Labs</h2>
                                 <div className="space-y-4">
                                    {filteredLabs.map(l => {
                                        const { isOpen, text } = getOpeningStatus(l.days, l.hours);
                                        return (
                                             <Link key={l.id} href={`/lab/${l.id}`} passHref>
                                                <Card className="hover:shadow-lg transition-shadow">
                                                    <CardContent className="p-4 flex gap-4">
                                                        <div className="relative w-24 h-24 rounded-md overflow-hidden shrink-0">
                                                            <Image src={l.image} alt={l.name} fill style={{objectFit:"cover"}} data-ai-hint="lab exterior" />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <div className="flex justify-between items-start">
                                                                <h3 className="font-semibold">{l.name}</h3>
                                                                <Badge variant={isOpen ? "secondary" : "destructive"}>{text}</Badge>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1"><MapPin className="w-4 h-4"/>{l.location}</p>
                                                            <div className="flex items-center gap-2 text-sm mt-1 text-amber-600">
                                                                <Star className="w-4 h-4 fill-current" /> {getAverageRating(l.reviewsList)} ({l.reviewsList?.length || 0} reviews)
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {l.acceptsHealthPoints && <Badge variant="outline" className="text-green-700 border-green-200"><PercentCircle className="mr-1 w-4 h-4"/> Accepts Health Points</Badge>}
                                                                {l.homeCollectionEnabled && <Badge variant="outline"><Truck className="mr-1 w-4 h-4"/> Home Collection</Badge>}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                         )}
                     </div>
                </div>
            )
        default:
            return null;
    }
  }

  return (
    <div className="space-y-8">
        {renderContent()}
        {selectedDoctor && (
             <BookingDialog
                isOpen={isBookingOpen}
                onOpenChange={setIsBookingOpen}
                doctor={selectedDoctor}
                clinics={clinics.filter(c => c.doctorId === selectedDoctor.id)}
                familyMembers={familyMembers}
                onConfirm={handleBookingConfirm}
            />
        )}
    </div>
  );
}

