
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Stethoscope, MapPin, Pill, Loader2, AlertTriangle, Building, Link as LinkIcon, Search, PercentCircle, Beaker, Calendar, Star, Briefcase, Filter, Clock, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { initialDoctors, initialClinics, initialPharmacies, initialLabs, mockPatientData } from '@/lib/mock-data';
import { mockFamilyMembers } from '@/lib/family-members';
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
type Doctor = typeof initialDoctors[0];
type Clinic = typeof initialClinics[0];
type Pharmacy = typeof initialPharmacies[0];
type Lab = typeof initialLabs[0];

const DOCTORS_KEY = 'doctorsData';
const FAMILY_KEY = 'familyMembers';
const CLINICS_KEY = 'mockClinics';
const PATIENTS_KEY = 'mockPatients';

interface NearbySearchProps {
    allowedServices?: ('doctor' | 'pharmacy' | 'lab')[];
}


export function NearbySearch({ allowedServices = ['doctor', 'pharmacy', 'lab'] }: NearbySearchProps) {
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);
  
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [familyMembers, setFamilyMembers] = useState(mockFamilyMembers);
  const [user, setUser] = useState<any | null>(null);
  
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
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
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);

      const storedDoctors = sessionStorage.getItem(DOCTORS_KEY);
      setDoctors(storedDoctors ? JSON.parse(storedDoctors) : initialDoctors);

      const storedClinics = sessionStorage.getItem(CLINICS_KEY);
      setClinics(storedClinics ? JSON.parse(storedClinics) : initialClinics);

      const storedPharmacies = sessionStorage.getItem('mockPharmacies');
      setPharmacies(storedPharmacies ? JSON.parse(storedPharmacies) : initialPharmacies);
      
      const storedLabs = sessionStorage.getItem('mockLabs');
      setLabs(storedLabs ? JSON.parse(storedLabs) : initialLabs);

      const storedFamily = sessionStorage.getItem(FAMILY_KEY);
      if (storedFamily) {
        setFamilyMembers(JSON.parse(storedFamily));
      } else {
        sessionStorage.setItem(FAMILY_KEY, JSON.stringify(mockFamilyMembers));
        setFamilyMembers(mockFamilyMembers);
      }
      
      handleLocationRequest();
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
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const showDoctors = allowedServices.includes('doctor');
    const showPharmacies = allowedServices.includes('pharmacy');
    const showLabs = allowedServices.includes('lab');

    // Filter doctors
    const filteredDoctors = showDoctors ? doctors.filter(d => {
        const feeData = getDoctorFeeRange(d.id);

        if (lowerCaseSearchTerm && !d.name.toLowerCase().includes(lowerCaseSearchTerm) && !d.specialty.toLowerCase().includes(lowerCaseSearchTerm)) {
            return false;
        }
        if (specialty !== 'All' && d.specialty !== specialty) {
            return false;
        }
        if (d.experience < experience) {
            return false;
        }
        if (feeRange !== 'All') {
            const [min, max] = feeRange.split('-').map(Number);
            if(max) {
                 if (feeData.min < min || feeData.min > max) return false;
            } else {
                 if (feeData.min < min) return false;
            }
        }
        // Mock distance filtering - in a real app, this would use lat/lng
        return true;
    }) : [];

    // Filter others only by search term if it exists
    const filteredPharmacies = showPharmacies && (lowerCaseSearchTerm ? pharmacies.filter(p => p.name.toLowerCase().includes(lowerCaseSearchTerm)) : pharmacies);
    const filteredLabs = showLabs && (lowerCaseSearchTerm ? labs.filter(l => l.name.toLowerCase().includes(lowerCaseSearchTerm)) : labs);
    
    // If search term is present, don't show all pharmacies/labs unless they match
    if(lowerCaseSearchTerm) {
        return { doctors: filteredDoctors, pharmacies: filteredPharmacies || [], labs: filteredLabs || [] };
    }
    
    // if filters are applied, only show doctors
    if (specialty !== 'All' || experience > 0 || feeRange !== 'All' || distance < 10) {
        return { doctors: filteredDoctors, pharmacies: [], labs: [] };
    }

    return { doctors: filteredDoctors, pharmacies: showPharmacies ? pharmacies : [], labs: showLabs ? labs : [] };

  }, [searchTerm, doctors, clinics, pharmacies, labs, specialty, experience, feeRange, distance, allowedServices]);
  
  const handleBookNow = (e: React.MouseEvent, doctor: Doctor) => {
    e.preventDefault();
    setSelectedDoctor(doctor);
    setIsBookingOpen(true);
  };
  
  const handleBookingConfirm = (patientId: string, clinicId: string, date: Date, time: string) => {
    if (!selectedDoctor) return;
    const clinic = clinics.find(c => c.id === clinicId);
    if (!clinic) return;

    let patientName = "Yourself";
    if(patientId !== 'self') {
        const member = mockFamilyMembers.find(m => m.id === patientId) || mockPatientData.find(p => p.id === patientId);
        if(member) patientName = member.name;
    }

    const newAppointment = {
        id: `appt_${Date.now()}`,
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

    const allPatients = JSON.parse(sessionStorage.getItem(PATIENTS_KEY) || '[]');
    const updatedPatients = [...allPatients, newAppointment];
    sessionStorage.setItem(PATIENTS_KEY, JSON.stringify(updatedPatients));

    const toastDescription = user?.role === 'health-coordinator' || user?.role === 'lab' || user?.role === 'pharmacy'
      ? `The appointment for ${patientName} at ${clinic.name} is booked. A receipt has been sent to the patient's email.`
      : `Your appointment at ${clinic.name} is booked. A receipt has been sent to your email. Your fee is secured and will be refunded as Health Points after the consultation is marked complete by the doctor.`;

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
                    {doctors.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2"><Stethoscope/> Doctors</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {doctors.map((doctor) => {
                                    return (
                                        <Card key={doctor.id} className="overflow-hidden h-full hover:shadow-xl transition-shadow duration-300 flex flex-col group">
                                            <Link href={`/doctor/${doctor.id}`} className="flex-grow">
                                                <CardHeader className="flex-row gap-4 items-start">
                                                    <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 border-2 border-primary/20">
                                                        <Image src={doctor.image} alt={`Dr. ${doctor.name}`} fill style={{objectFit:"cover"}} data-ai-hint={doctor.dataAiHint} />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <CardTitle className="font-headline text-xl">{doctor.name}</CardTitle>
                                                        <CardDescription className="flex items-center gap-2 pt-1">
                                                            <Stethoscope className="w-4 h-4 text-primary" /> <span>{doctor.specialty}</span>
                                                        </CardDescription>
                                                        <div className="flex items-center text-sm text-muted-foreground gap-2 mt-2">
                                                            <MapPin className="w-4 h-4"/> 
                                                            <span>{doctor.location}</span>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="flex-grow space-y-2">
                                                    <div className="flex items-center gap-4 text-sm">
                                                        <div className="flex items-center gap-1 text-amber-500">
                                                            <Star className="w-4 h-4 fill-current" />
                                                            <span className="font-bold">{getAverageRating(doctor.reviewsList)}</span>
                                                            <span className="text-xs text-muted-foreground ml-1">({doctor.reviewsList?.length ?? 0})</span>
                                                        </div>
                                                        <Separator orientation="vertical" className="h-4"/>
                                                        <div className="flex items-center gap-1 text-muted-foreground">
                                                            <Briefcase className="w-4 h-4" />
                                                            <span>{doctor.experience} yrs exp.</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm flex items-center gap-2 font-semibold text-primary pt-1">
                                                      <span>{getDoctorFeeRange(doctor.id).range}</span>
                                                    </div>
                                                </CardContent>
                                            </Link>
                                            <CardFooter>
                                                <Button className="w-full" onClick={(e) => handleBookNow(e, doctor)}>
                                                    <Calendar className="mr-2 h-4 w-4" /> Book Now
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                    {pharmacies.length > 0 && (
                         <section>
                            <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2"><Pill/> Pharmacies</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pharmacies.map((pharmacy) => {
                                    const { isOpen, text } = getOpeningStatus(pharmacy.days, pharmacy.hours);
                                    return (
                                     <Link href={`/pharmacy/${pharmacy.id}`} key={pharmacy.id} className="group">
                                        <Card className="overflow-hidden h-full group-hover:shadow-xl transition-shadow duration-300 flex flex-col">
                                            <CardHeader className="p-0">
                                                <div className="relative w-full h-40">
                                                     <Image src={pharmacy.image} alt={pharmacy.name} fill style={{objectFit:"cover"}} data-ai-hint="pharmacy exterior" />
                                                     <Badge className={isOpen ? 'bg-green-600 text-white' : 'bg-destructive text-white'} style={{position: 'absolute', top: '10px', left: '10px'}}>
                                                        <Clock className="w-3 h-3 mr-1.5"/> {text}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 flex-grow space-y-2">
                                                 <CardTitle className="font-headline text-xl ">{pharmacy.name}</CardTitle>
                                                <div className="flex items-center text-muted-foreground gap-2 mt-2 text-sm">
                                                    <MapPin className="w-4 h-4"/> 
                                                    <span>{pharmacy.location}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-amber-500">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <span className="font-bold text-sm">{getAverageRating(pharmacy.reviewsList)}</span>
                                                    <span className="text-xs text-muted-foreground ml-1">({pharmacy.reviewsList?.length ?? 0} reviews)</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {pharmacy.acceptsHealthPoints && (
                                                        <Badge variant="secondary">
                                                            <PercentCircle className="mr-2 text-primary" /> Accepts Health Points ({pharmacy.discount}%)
                                                        </Badge>
                                                    )}
                                                    {pharmacy.homeDeliveryEnabled && (
                                                        <Badge variant="secondary">
                                                            <Truck className="mr-2 text-primary" /> Home Delivery
                                                        </Badge>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                    )
                                })}
                            </div>
                        </section>
                    )}
                    
                     {labs.length > 0 && (
                         <section>
                            <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2"><Beaker/> Labs</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {labs.map((lab) => {
                                    const { isOpen, text } = getOpeningStatus(lab.days, lab.hours);
                                    return (
                                     <Link href={`/lab/${lab.id}`} key={lab.id} className="group">
                                        <Card className="overflow-hidden h-full group-hover:shadow-xl transition-shadow duration-300 flex flex-col">
                                             <CardHeader className="p-0">
                                                <div className="relative w-full h-40">
                                                     <Image src={lab.image || 'https://picsum.photos/400/300'} alt={lab.name || 'Lab image'} fill style={{objectFit:"cover"}} data-ai-hint="lab exterior" />
                                                     <Badge className={isOpen ? 'bg-green-600 text-white' : 'bg-destructive text-white'} style={{position: 'absolute', top: '10px', left: '10px'}}>
                                                        <Clock className="w-3 h-3 mr-1.5"/> {text}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 flex-grow">
                                                <CardTitle className="font-headline text-xl">{lab.name}</CardTitle>
                                                <div className="flex items-center text-muted-foreground gap-2 mt-2 text-sm">
                                                    <MapPin className="w-4 h-4"/> 
                                                    <span>{lab.location}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-amber-500 mt-2">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <span className="font-bold text-sm">{getAverageRating(lab.reviewsList)}</span>
                                                     <span className="text-xs text-muted-foreground ml-1">({lab.reviewsList?.length ?? 0} reviews)</span>
                                                </div>
                                                {lab.acceptsHealthPoints && (
                                                    <Badge className="mt-4" variant="secondary">
                                                        <PercentCircle className="mr-2 text-primary" /> Accepts Health Points ({lab.discount}%)
                                                    </Badge>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Link>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                     {(doctors.length === 0 && pharmacies.length === 0 && labs.length === 0) && (
                        <div className="text-center py-16 text-muted-foreground">
                            <p>No results found for your search or filters.</p>
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
        {selectedDoctor && isBookingOpen && (
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
