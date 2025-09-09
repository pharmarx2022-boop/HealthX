

'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Calendar, Clock, Stethoscope, FileText, MessageSquare, CreditCard, RefreshCw, BadgeCheck, BellPlus, CalendarPlus, Loader2, UserX } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { format, addDays } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockPatientData } from '@/lib/mock-data';
import { recordTransaction } from '@/lib/transactions';
import { addNotification } from '@/lib/notifications';

const PATIENTS_KEY = 'mockPatients';

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState<any>(null);
  const [nextAppointment, setNextAppointment] = useState<Date | undefined>(undefined);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(undefined);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const allPatients = JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
        const foundPatient = allPatients.find((p: any) => p.id === id);
        setPatient(foundPatient);
    }
    setIsLoading(false);
  }, [id]);
  
  useEffect(() => {
    // Automated action logic
    if (!patient || patient.status !== 'upcoming') return;

    const gracePeriodEndDate = addDays(new Date(patient.appointmentDate), 2);
    const now = new Date();

    if (now > gracePeriodEndDate) {
      handleMarkAsComplete();
      toast({
        title: "Appointment Auto-Completed",
        description: `The grace period for ${patient.name}'s appointment has passed. Refund and Health Points have been automatically processed.`,
      });
    }
  }, [patient]);


  const handleMarkAsComplete = () => {
    if (!patient) return;

    // Credit Health Points
    recordTransaction(patient.patientId, {
      type: 'credit',
      amount: patient.consultationFee,
      description: `Health Point bonus for consultation at ${patient.clinic}`,
      date: new Date(),
    });

    // Update appointment status and refund status
    const allPatients = JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
    const updatedPatients = allPatients.map((p: any) => 
        p.id === patient.id ? { ...p, status: 'done', refundStatus: 'Refunded (Completed)' } : p
    );
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(updatedPatients));

    // Send notification
     addNotification(patient.patientId, {
        title: 'Health Points Added!',
        message: `You have received INR ${patient.consultationFee.toFixed(2)} in Health Points for your recent consultation. Your security deposit has been refunded.`,
        icon: 'gift',
        href: '/patient/wallet'
    });

    toast({
        title: "Consultation Completed!",
        description: `Health Points issued and security deposit refunded for ${patient.name}.`,
    });
    router.push('/doctor/dashboard');
  };
  
   const handleMarkAsAbsent = () => {
    if (!patient) return;
    
    // Update appointment status to 'missed'
    const allPatients = JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
    const updatedPatients = allPatients.map((p: any) => 
        p.id === patient.id ? { ...p, status: 'missed', refundStatus: 'Forfeited (No-Show)' } : p
    );
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(updatedPatients));

    addNotification(patient.patientId, {
        title: 'Appointment Marked as No-Show',
        message: `Your appointment at ${patient.clinic} was marked as missed. Your security deposit has been forfeited.`,
        icon: 'calendar',
    });

    toast({
        title: "Patient Marked as Absent",
        description: `The security deposit for ${patient.name} has been forfeited.`,
        variant: "destructive"
    });
    router.push('/doctor/dashboard');
  };

  const handleSetReminder = () => {
    if (!nextAppointment) {
        toast({
            title: "No date selected",
            description: "Please select a date for the next appointment reminder.",
            variant: "destructive",
        });
        return;
    }
     toast({
        title: "Action Required",
        description: "Backend integration needed to set reminder.",
    });
  }

  const handleReschedule = () => {
    if (!rescheduleDate || !patient) {
        toast({ title: "No date selected", description: "Please select a new date for the appointment.", variant: "destructive" });
        return;
    }
     toast({
        title: "Action Required",
        description: "Backend integration needed to reschedule appointment.",
    });
    setIsRescheduleOpen(false);
    setRescheduleDate(undefined);
  }

  if (isLoading) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-slate-50/50 flex items-center justify-center">
                <Loader2 className="animate-spin mr-2"/>
                <span>Loading patient data...</span>
            </main>
            <Footer />
        </div>
    );
  }

  if (!patient) {
    notFound();
    return null;
  }
  
  const isActionAllowed = () => {
    if (!patient || patient.status !== 'upcoming') return false;
    const now = new Date();
    const appointmentDate = new Date(patient.appointmentDate);
    // Allow action from the time of appointment up to 2 days after.
    const gracePeriodEndDate = addDays(new Date(appointmentDate), 2);

    return now >= appointmentDate && now < gracePeriodEndDate;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
          <div className="mb-6">
            <Button asChild variant="outline">
              <Link href="/doctor/dashboard">
                <ArrowLeft className="mr-2" />
                Back to Patient List
              </Link>
            </Button>
          </div>

          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader className="flex flex-col md:flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="font-headline text-3xl">{patient.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1 text-base">
                  Patient ID: {patient.id}
                </CardDescription>
              </div>
              <Badge variant={patient.status === 'done' ? 'secondary' : 'default'} className="text-base capitalize">
                {patient.status}
              </Badge>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-12">
              <div className="space-y-6">
                <h3 className="font-semibold text-lg border-b pb-2">Appointment Details</h3>
                <div className="flex items-center text-muted-foreground gap-3">
                  <Calendar className="w-5 h-5 text-primary"/> 
                  <span>{format(new Date(patient.appointmentDate), 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center text-muted-foreground gap-3">
                  <Clock className="w-5 h-5 text-primary"/> 
                  <span>{format(new Date(patient.appointmentDate), 'p')}</span>
                </div>
                 <div className="flex items-center text-muted-foreground gap-3">
                  <Stethoscope className="w-5 h-5 text-primary"/> 
                  <span>Clinic: {patient.clinic}</span>
                </div>
              </div>
               <div className="space-y-6">
                <h3 className="font-semibold text-lg border-b pb-2">Consultation Info</h3>
                <div className="flex items-start text-muted-foreground gap-3">
                  <FileText className="w-5 h-5 text-primary mt-1"/> 
                  <div>
                    <p className="font-medium text-foreground">Reason for Visit</p>
                    <p>{patient.consultation}</p>
                  </div>
                </div>
                {patient.notes && (
                    <div className="flex items-start text-muted-foreground gap-3">
                        <MessageSquare className="w-5 h-5 text-primary mt-1"/>
                        <div>
                            <p className="font-medium text-foreground">Doctor's Notes</p>
                            <p>{patient.notes}</p>
                        </div>
                    </div>
                )}
              </div>
               <div className="space-y-6 md:col-span-2">
                <h3 className="font-semibold text-lg border-b pb-2">Billing & Refund</h3>
                 <div className="flex items-center text-muted-foreground gap-3">
                  <CreditCard className="w-5 h-5 text-primary"/> 
                  <div>
                    <p className="font-medium text-foreground">Consultation Fee</p>
                    <p>INR {patient.consultationFee.toFixed(2)} (Paid in cash at clinic)</p>
                  </div>
                </div>
                 <div className="flex items-center text-muted-foreground gap-3">
                  <RefreshCw className="w-5 h-5 text-primary"/> 
                  <div>
                    <p className="font-medium text-foreground">Security Deposit Refund</p>
                    <p>{patient.refundStatus}</p>
                    <p className="text-xs text-muted-foreground">The deposit is refunded automatically 2 days after the appointment unless the patient is marked absent. Platform fees are non-refundable.</p>
                  </div>
                </div>
              </div>
               <div className="space-y-6 md:col-span-2">
                <h3 className="font-semibold text-lg border-b pb-2">Next Appointment Reminder</h3>
                 <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <BellPlus className="w-5 h-5 text-primary shrink-0"/> 
                  <div className="flex-grow">
                    <p className="font-medium text-foreground">
                        {patient.nextAppointmentDate && !isNaN(new Date(patient.nextAppointmentDate).getTime())
                            ? `Next check-up scheduled for: ${format(new Date(patient.nextAppointmentDate), 'PPP')}` 
                            : "No reminder set."
                        }
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full sm:w-auto">
                                    <Calendar className="mr-2"/>
                                    {nextAppointment ? format(nextAppointment, 'PPP') : 'Select Date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <CalendarPicker
                                    mode="single"
                                    selected={nextAppointment}
                                    onSelect={setNextAppointment}
                                    initialFocus
                                    disabled={(date) => date < new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                        <Button onClick={handleSetReminder} className="w-full sm:w-auto">Set Reminder</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
             {patient.status === 'upcoming' && (
                <CardFooter className="bg-slate-50/70 mt-6 py-4 px-6 border-t flex-wrap justify-center sm:justify-end items-center gap-4">
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                             <Button variant="destructive" size="lg" className="w-full sm:w-auto" disabled={!isActionAllowed()}>
                               <UserX className="mr-2"/> Patient Absent
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm No-Show for {patient.name}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will forfeit the patient's security deposit. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleMarkAsAbsent} className="bg-destructive hover:bg-destructive/90">Confirm Absent</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="lg" className="w-full sm:w-auto" disabled={!isActionAllowed()}>
                               <BadgeCheck className="mr-2"/> Consultation Done
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Consultation Completion</AlertDialogTitle>
                                <AlertDialogDescription>
                                   This will immediately refund the security deposit and issue INR {patient.consultationFee.toFixed(2)} in Health Points to {patient.name}.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleMarkAsComplete}>Confirm & Process</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
