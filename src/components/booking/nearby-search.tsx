
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Stethoscope, MapPin, Pill, Loader2, AlertTriangle, Building, Link as LinkIcon, Search, PercentCircle, Beaker, Calendar, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { initialDoctors, initialClinics, initialPharmacies, initialLabs, mockPatientData } from '@/lib/mock-data';
import { mockFamilyMembers } from '@/lib/family-members';
import { Badge } from '../ui/badge';
import { BookingDialog } from './booking-dialog';
import { useToast } from '@/hooks/use-toast';

// Types
type Doctor = typeof initialDoctors[0];
type Clinic = typeof initialClinics[0];
type Pharmacy = typeof initialPharmacies[0];
type Lab = typeof initialLabs[0];

const DOCTORS_KEY = 'doctorsData';
const FAMILY_KEY = 'familyMembers';
const CLINICS_KEY = 'mockClinics';
const PATIENTS_KEY = 'mockPatients';


const WhatsAppIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        className="text-green-500"
    >
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.38 1.25 4.81L2 22l5.29-1.38c1.37.71 2.93 1.11 4.59 1.11 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2z"></path>
        <path d="M16.92 14.37c-.14-.07-.84-.42-.97-.47-.13-.05-.23-.07-.33.07-.1.14-.37.47-.45.57-.08.1-.17.11-.3.05-.14-.07-1.46-.54-2.78-1.72-1.03-.92-1.73-2.05-2.02-2.39-.3-.34-.03-.52.04-.57.07-.05.14-.14.22-.22.08-.08.1-.14.17-.24.07-.1.03-.17-.02-.24-.05-.07-.33-.8-.45-1.1-.12-.3-.24-.26-.33-.26h-.3c-.1 0-.24.03-.37.14-.13.11-.5.48-.5.58 0 .1.03.14.07.17l.03.03c.53.47 1.02 1.14 1.48 1.83.47.7 1.13 1.52 2.39 2.11.3.14.56.22.84.28.3.06.84.05 1.12-.08.3-.14.84-.95.95-1.12.11-.17.11-.3.08-.37z" fill="white"></path>
    </svg>
)

export function NearbySearch() {
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
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
    if (doctorClinics.length === 0) return 'N/A';
    
    const fees = doctorClinics.map(c => c.consultationFee);
    const minFee = Math.min(...fees);
    const maxFee = Math.max(...fees);

    if (minFee === maxFee) {
        return `INR ${minFee.toFixed(2)}`;
    }
    return `INR ${minFee.toFixed(2)} - INR ${maxFee.toFixed(2)}`;
  };


  const searchResults = useMemo(() => {
    const allPharmacies = pharmacies;
    const allLabs = labs;

    if (!searchTerm) {
        return { doctors: doctors, pharmacies: allPharmacies, labs: allLabs };
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const filteredDoctors = doctors.filter(d => 
        d.name.toLowerCase().includes(lowerCaseSearchTerm) || 
        d.specialty.toLowerCase().includes(lowerCaseSearchTerm)
    );

    const filteredPharmacies = allPharmacies.filter(p =>
        p.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
    
    const filteredLabs = allLabs.filter(l =>
        l.name.toLowerCase().includes(lowerCaseSearchTerm)
    );

    return { doctors: filteredDoctors, pharmacies: filteredPharmacies, labs: filteredLabs };

  }, [searchTerm, clinics, pharmacies, labs, doctors]);
  
  const handleBookNow = (doctor: Doctor) => {
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

    toast({
        title: "Booking Confirmed!",
        description: `Your appointment at ${clinic.name} with Dr. ${selectedDoctor.name} on ${date.toDateString()} at ${time} has been booked.`,
    });
    setIsBookingOpen(false);
    setSelectedDoctor(null);
  };
  
  const getAverageRating = (reviewsList: any[] | undefined) => {
    if (!reviewsList || reviewsList.length === 0) return 'N/A';
    const totalRating = reviewsList.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviewsList.length).toFixed(1);
  };


  const renderContent = () => {
    switch(status) {
        case 'idle':
            return (
                <div className="text-center py-12">
                    <Button size="lg" onClick={handleLocationRequest}>
                        <MapPin className="mr-2" /> Find Services Near Me
                    </Button>
                </div>
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
                    {doctors.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2"><Stethoscope/> Doctors</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {doctors.map((doctor) => {
                                    return (
                                        <Card key={doctor.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
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
                                            <CardContent className="flex-grow">
                                                <div className="text-sm flex items-center gap-2 font-semibold text-primary">
                                                  <span>{getDoctorFeeRange(doctor.id)}</span>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="grid grid-cols-2 gap-2">
                                                <Button asChild variant="outline">
                                                    <Link href={`/doctor/${doctor.id}`}>
                                                        View Profile
                                                    </Link>
                                                </Button>
                                                <Button className="w-full" onClick={() => handleBookNow(doctor)}>
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
                                {pharmacies.map((pharmacy) => (
                                     <Link href={`/pharmacy/${pharmacy.id}`} key={pharmacy.id} className="group">
                                        <Card className="overflow-hidden h-full group-hover:shadow-xl transition-shadow duration-300 flex flex-col">
                                            <CardHeader className="p-0">
                                                <div className="relative w-full h-40">
                                                     <Image src={pharmacy.image} alt={pharmacy.name} fill style={{objectFit:"cover"}} data-ai-hint="pharmacy exterior" />
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 flex-grow">
                                                 <CardTitle className="font-headline text-xl ">{pharmacy.name}</CardTitle>
                                                <div className="flex items-center text-muted-foreground gap-2 mt-2 text-sm">
                                                    <MapPin className="w-4 h-4"/> 
                                                    <span>{pharmacy.location}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-amber-500 mt-2">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <span className="font-bold text-sm">{getAverageRating(pharmacy.reviewsList)}</span>
                                                    <span className="text-xs text-muted-foreground ml-1">({pharmacy.reviewsList?.length ?? 0} reviews)</span>
                                                </div>
                                                {pharmacy.acceptsHealthPoints && (
                                                    <Badge className="mt-4" variant="secondary">
                                                        <PercentCircle className="mr-2 text-primary" /> Accepts Health Points ({pharmacy.discount}%)
                                                    </Badge>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                    
                     {labs.length > 0 && (
                         <section>
                            <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2"><Beaker/> Labs</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {labs.map((lab) => (
                                     <Link href={`/lab/${lab.id}`} key={lab.id} className="group">
                                        <Card className="overflow-hidden h-full group-hover:shadow-xl transition-shadow duration-300 flex flex-col">
                                             <CardHeader className="p-0">
                                                <div className="relative w-full h-40">
                                                     <Image src={lab.image} alt={lab.name} fill style={{objectFit:"cover"}} data-ai-hint="lab exterior" />
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
                                ))}
                            </div>
                        </section>
                    )}

                     {(doctors.length === 0 && pharmacies.length === 0 && labs.length === 0) && (
                        <div className="text-center py-16 text-muted-foreground">
                            <p>No results found for "{searchTerm}".</p>
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
