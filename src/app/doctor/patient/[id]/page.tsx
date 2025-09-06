

'use client';

import { useParams, notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Calendar, Clock, Stethoscope, FileText, MessageSquare, CreditCard, RefreshCw, BadgeCheck, BellPlus } from 'lucide-react';
import Link from 'next/link';
import { mockPatientData as mockPatients } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { recordTransaction } from '@/lib/transactions';
import { addNotification } from '@/lib/notifications';
import { initialDoctors } from '@/lib/mock-data';
import { checkDoctorMilestone } from '@/lib/referrals';
import { recordCommission } from '@/lib/commission-wallet';

export default function PatientDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [nextAppointment, setNextAppointment] = useState<Date | undefined>(undefined);

  // We need to manage patient state locally to reflect changes
  const [allPatients, setAllPatients] = useState(mockPatients);
  const patient = allPatients.find(p => p.id === id);
  
  // This ensures we have the latest patient data if the user navigates back and forth
  useEffect(() => {
    setIsClient(true);
    const storedPatients = sessionStorage.getItem('mockPatients');
    if (storedPatients) {
      setAllPatients(JSON.parse(storedPatients));
    }
  }, []);
  
  useEffect(() => {
    if (patient?.nextAppointmentDate && !isNaN(new Date(patient.nextAppointmentDate).getTime())) {
        setNextAppointment(new Date(patient.nextAppointmentDate));
    }
  }, [patient]);


  const handleMarkAsComplete = () => {
    if (!patient) return;
    
    // Credit Health Points to the patient
    const patientUserId = patient.id; 
    recordTransaction(patientUserId, {
        type: 'credit',
        amount: patient.consultationFee,
        description: `Bonus Health Points from consultation on ${format(new Date(patient.appointmentDate), 'PP')}`,
        date: new Date(),
    });
    const doctor = initialDoctors.find(d => d.id === patient.doctorId);
    
    addNotification(patientUserId, {
        title: 'Health Points Added!',
        message: `You've earned INR ${patient.consultationFee.toFixed(2)} in Health Points from your consultation with ${doctor?.name || 'your doctor'}.`,
        icon: 'wallet',
        href: '/patient/my-health'
    });

    // Check for doctor referral milestone
    if (doctor) {
        checkDoctorMilestone(doctor.id);
    }
    
    // Award commission if booked by a partner
    if (patient.bookedById && patient.bookedByRole) {
        const commissionAmount = patient.consultationFee * 0.05;
        recordCommission(patient.bookedById, {
            type: 'credit',
            amount: commissionAmount,
            description: `Commission for booking for ${patient.name}`,
            date: new Date(),
            status: 'success'
        });
        addNotification(patient.bookedById, {
            title: 'Commission Earned!',
            message: `You earned INR ${commissionAmount.toFixed(2)} for a completed appointment.`,
            icon: 'gift',
            href: `/${patient.bookedByRole}/dashboard`
        });
    }

    // Update patient status
    const updatedPatients = allPatients.map(p => {
      if (p.id === id) {
        return { ...p, status: 'done', refundStatus: 'Refunded' };
      }
      return p;
    });

    setAllPatients(updatedPatients);
    // Persist changes to session storage to simulate a database update
    sessionStorage.setItem('mockPatients', JSON.stringify(updatedPatients));

    toast({
        title: "Consultation Complete!",
        description: `A refund for INR ${patient?.consultationFee.toFixed(2)} has been issued to the patient's original payment method, and Health Points have been credited.`,
    });
  };

  const handleSetReminder = () => {
    if (!nextAppointment || !patient) {
        toast({
            title: "No date selected",
            description: "Please select a date for the next appointment reminder.",
            variant: "destructive",
        });
        return;
    }

    const updatedPatients = allPatients.map(p => {
      if (p.id === id) {
        return { ...p, nextAppointmentDate: nextAppointment.toISOString() };
      }
      return p;
    });

    setAllPatients(updatedPatients);
    sessionStorage.setItem('mockPatients', JSON.stringify(updatedPatients));
    
    addNotification(patient.id, {
        title: 'Follow-up Reminder Set',
        message: `Your doctor scheduled a follow-up for ${format(nextAppointment, 'PPP')}.`,
        icon: 'calendar',
        href: '/patient/my-health'
    });

    toast({
        title: "Reminder Set",
        description: `Patient will be reminded for their appointment on ${format(nextAppointment, 'PPP')}.`,
    });
  }

  if (!isClient) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-slate-50/50 flex items-center justify-center">
                <p>Loading patient data...</p>
            </main>
            <Footer />
        </div>
    );
  }

  if (!patient) {
    // This can happen if the page is loaded directly and state is not yet synced.
    // A loading state or a redirect could be useful here in a real app.
    notFound();
    return null;
  }

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
                    <p>INR {patient.consultationFee.toFixed(2)}</p>
                  </div>
                </div>
                 <div className="flex items-center text-muted-foreground gap-3">
                  <RefreshCw className="w-5 h-5 text-primary"/> 
                  <div>
                    <p className="font-medium text-foreground">Refund Status</p>
                    <p>{patient.refundStatus}</p>
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
                <CardFooter className="bg-slate-50/70 mt-6 py-4 px-6 border-t">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="lg" className="w-full sm:w-auto">
                               <BadgeCheck className="mr-2"/> Consultation done & God bless you
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Consultation Completion</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will mark the consultation as complete. A full refund of INR {patient.consultationFee.toFixed(2)} will be issued to the patient's original payment method, and an equal amount of Health Points will be credited to their account as a reward. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleMarkAsComplete}>Confirm & Proceed</AlertDialogAction>
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
