

'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, MapPin, Calendar, Star, Loader2, MessageSquare, UserPlus, Clock, Briefcase, Link as LinkIcon, CreditCard, Globe, BadgeCheck } from 'lucide-react';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { initialDoctors, initialClinics, mockPatientData } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { BookingDialog } from '@/components/booking/booking-dialog';
import { mockFamilyMembers } from '@/lib/family-members';
import { useToast } from '@/hooks/use-toast';
import { mockPatientData as mockPatients } from '@/lib/mock-data';
import Link from 'next/link';

const DOCTORS_KEY = 'doctorsData';
const FAMILY_KEY = 'familyMembers';
const CLINICS_KEY = 'mockClinics';
const PATIENTS_KEY = 'mockPatients';

type Clinic = typeof initialClinics[0];

export default function DoctorDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  const [doctors, setDoctors] = useState(initialDoctors);
  const [familyMembers, setFamilyMembers] = useState(mockFamilyMembers);
  const [doctorClinics, setDoctorClinics] = useState<Clinic[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [allAppointments, setAllAppointments] = useState(mockPatients);
  
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);

      const storedDoctors = localStorage.getItem(DOCTORS_KEY);
      if (storedDoctors) {
        setDoctors(JSON.parse(storedDoctors));
      } else {
        localStorage.setItem(DOCTORS_KEY, JSON.stringify(initialDoctors));
      }

      const storedFamily = localStorage.getItem(FAMILY_KEY);
      if (storedFamily) {
        setFamilyMembers(JSON.parse(storedFamily));
      } else {
        localStorage.setItem(FAMILY_KEY, JSON.stringify(mockFamilyMembers));
        setFamilyMembers(mockFamilyMembers);
      }

      const storedClinics = localStorage.getItem(CLINICS_KEY);
      const allClinics = storedClinics ? JSON.parse(storedClinics) : initialClinics;
      setDoctorClinics(allClinics.filter((c: Clinic) => c.doctorId === id));

      const storedPatients = localStorage.getItem(PATIENTS_KEY);
      setAllAppointments(storedPatients ? JSON.parse(storedPatients) : mockPatients);
    }
  }, [id]);

  const doctor = doctors.find(d => d.id === id);

  const completedConsultations = useMemo(() => {
      if (!doctor) return 0;
      return allAppointments.filter(p => p.doctorId === doctor.id && p.status === 'done').length;
  }, [doctor, allAppointments]);
  
  if (!isClient) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-slate-50/50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary"/>
                <p className="ml-4 text-muted-foreground">Loading doctor profile...</p>
            </main>
            <Footer />
        </div>
    );
  }

  if (!doctor) {
    notFound();
  }
  
  const totalReviews = doctor.reviewsList?.length ?? 0;
  const averageRating = totalReviews > 0
    ? (doctor.reviewsList.reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(1)
    : 'N/A';

  const handleBookingConfirm = (patientId: string, clinicId: string, date: Date, time: string, transactionId: string) => {
    const clinic = doctorClinics.find(c => c.id === clinicId);
    if (!clinic) return;

    let patientName = "Yourself";
    if(patientId !== 'self') {
        const member = mockFamilyMembers.find(m => m.id === patientId) || mockPatientData.find(p => p.id === patientId);
        if(member) patientName = member.name;
    }

    const newAppointment = {
        id: `appt_${Date.now()}`,
        transactionId,
        name: patientName,
        clinic: clinic.name,
        doctorId: doctor.id,
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

    const allPatients = JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
    const updatedPatients = [...allPatients, newAppointment];
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(updatedPatients));
    setAllAppointments(updatedPatients);
    
    const toastDescription = `Your appointment at ${clinic.name} is booked. Remember to pay INR ${clinic.consultationFee.toFixed(2)} in cash at the clinic. Your online deposit is secure and will be refunded after your visit.`;

    toast({
        title: "Booking Confirmed!",
        description: toastDescription,
        duration: 9000,
    });
    setIsBookingOpen(false);
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
            <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden shrink-0 border-4 border-primary/20 mx-auto">
                           <Image src={doctor.image} alt={`Dr. ${doctor.name}`} fill style={{objectFit:"cover"}} data-ai-hint={doctor.dataAiHint} />
                        </div>
                        <div className="flex-grow text-center md:text-left">
                            <CardTitle className="font-headline text-3xl">{doctor.name}</CardTitle>
                            <CardDescription className="flex items-center justify-center md:justify-start gap-2 pt-2 text-base">
                                <Stethoscope className="w-5 h-5 text-primary" /> <span>{doctor.specialty}</span>
                            </CardDescription>
                             <div className="flex items-center justify-center md:justify-start gap-4 text-muted-foreground mt-3 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-5 h-5"/> 
                                    <span>{doctor.experience} years experience</span>
                                </div>
                                <Separator orientation="vertical" className="h-5" />
                                <div className="flex items-center gap-2">
                                    <BadgeCheck className="w-5 h-5" />
                                    <span>{completedConsultations} consultations completed</span>
                                </div>
                                {doctor.googleMapsLink && (
                                     <>
                                        <Separator orientation="vertical" className="h-5" />
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5"/> 
                                            <a href={doctor.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                View on Map
                                            </a>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-4 pt-3">
                                <div className="flex items-center gap-1 text-amber-500">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span className="font-bold">{averageRating}</span>
                                </div>
                                <span className="text-muted-foreground">({totalReviews} reviews)</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                     <div>
                        <h3 className="font-semibold text-xl font-headline mb-2">About Dr. {doctor.name.split(' ').pop()}</h3>
                        <p className="text-muted-foreground">{doctor.bio}</p>
                    </div>
                   
                    <Button size="lg" className="w-full mt-4 text-lg" onClick={() => setIsBookingOpen(true)}>
                        <Calendar className="mr-2"/> Book Appointment
                    </Button>
                </CardContent>
                 <Separator/>
                 <CardContent className="p-6">
                    <h3 className="text-xl font-semibold font-headline mb-4">Clinics & Fees</h3>
                     {doctorClinics.length > 0 ? (
                        <div className="space-y-4">
                            {doctorClinics.map((clinic) => (
                                <Card key={clinic.id} className="bg-slate-50/70">
                                    <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                                        <div className="flex-grow">
                                            <p className="font-bold">{clinic.name}</p>
                                            <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
                                                <MapPin className="w-4 h-4"/>
                                                <span>{clinic.location}</span>
                                                 {clinic.googleMapsLink && (
                                                    <Link href={clinic.googleMapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:underline">
                                                        <LinkIcon className="w-4 h-4" />
                                                    </Link>
                                                 )}
                                            </div>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                                <Calendar className="w-4 h-4"/> {clinic.days.join(', ')}
                                            </p>
                                             <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                                <Clock className="w-4 h-4"/> {clinic.slots}
                                            </p>
                                        </div>
                                        <div className="font-bold text-lg text-primary mt-4 md:mt-0">
                                            <span>INR {clinic.consultationFee.toFixed(2)}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                     ) : (
                        <p className="text-muted-foreground">No clinics listed for this doctor.</p>
                     )}
                 </CardContent>
                 <Separator/>
                 <CardContent className="p-6">
                    <h3 className="text-xl font-semibold font-headline mb-4">Patient Reviews</h3>
                    {doctor.reviewsList && doctor.reviewsList.length > 0 ? (
                        <div className="space-y-6">
                            {doctor.reviewsList.map((review, index) => (
                                <div key={index} className="flex gap-4">
                                    <Avatar>
                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${review.patientName}`} alt={review.patientName} />
                                        <AvatarFallback>{review.patientName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold">{review.patientName}</p>
                                            <div className="flex items-center gap-1 text-amber-500">
                                                 {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground mt-1">{review.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No reviews yet.</p>
                    )}
                 </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
      
      <BookingDialog
        isOpen={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        doctor={doctor}
        clinics={doctorClinics}
        familyMembers={familyMembers}
        onConfirm={handleBookingConfirm}
      />
    </div>
  );
}

    
