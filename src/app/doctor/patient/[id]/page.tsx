
'use client';

import { useParams, notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Calendar, Clock, Stethoscope, FileText, MessageSquare, CreditCard, RefreshCw, BadgeCheck, BellPlus } from 'lucide-react';
import Link from 'next/link';
import { mockPatients } from '@/components/doctor/patient-list';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { recordTransaction } from '@/lib/transactions';
import { recordAgentCommission } from '@/lib/agent-data';

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
    const patientUserId = patient.name.split(' ')[0].toLowerCase() + '_sharma'; // simple mapping for demo
    recordTransaction(patientUserId, {
        type: 'credit',
        amount: patient.consultationFee,
        description: `Cashback from consultation on ${format(new Date(patient.appointmentDate), 'PP')}`,
        date: new Date(),
    });

    // If an agent booked this, credit commission to them
    if(patient.agentId) {
        const commissionAmount = patient.consultationFee * 0.05; // 5% commission for demo
        recordAgentCommission(patient.agentId, {
            type: 'credit',
            amount: commissionAmount,
            description: `Commission from booking for ${patient.name}`,
            date: new Date(),
        });
        toast({
            title: "Agent Commission Paid",
            description: `A commission of ₹${commissionAmount.toFixed(2)} has been credited to agent ${patient.agentId}.`
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
        title: "Consultation Complete",
        description: `Refund for ₹${patient?.consultationFee.toFixed(2)} initiated. An equal amount of Health Points has been credited to the patient.`,
    });
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

    const updatedPatients = allPatients.map(p => {
      if (p.id === id) {
        return { ...p, nextAppointmentDate: nextAppointment.toISOString() };
      }
      return p;
    });

    setAllPatients(updatedPatients);
    sessionStorage.setItem('mockPatients', JSON.stringify(updatedPatients));

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
            <CardHeader className="flex flex-row items-start justify-between">
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
                    <p>₹{patient.consultationFee.toFixed(2)}</p>
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
                 <div className="flex items-center text-muted-foreground gap-3">
                  <BellPlus className="w-5 h-5 text-primary"/> 
                  <div>
                    <p className="font-medium text-foreground">
                        {patient.nextAppointmentDate && !isNaN(new Date(patient.nextAppointmentDate).getTime())
                            ? `Next check-up scheduled for: ${format(new Date(patient.nextAppointmentDate), 'PPP')}` 
                            : "No reminder set."
                        }
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline">
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
                        <Button onClick={handleSetReminder}>Set Reminder</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
             {patient.status === 'upcoming' && (
                <CardFooter className="bg-slate-50/70 mt-6 py-4 px-6 border-t">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="lg">
                               <BadgeCheck className="mr-2"/> Consultation done & God bless you
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Consultation Completion</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will mark the consultation as complete. A refund of ₹{patient.consultationFee.toFixed(2)} will be issued to the patient's original payment method, and an equal amount of Health Points will be credited to their account. This action cannot be undone.
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
