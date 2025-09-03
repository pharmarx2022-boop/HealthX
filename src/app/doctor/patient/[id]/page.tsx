
'use client';

import { notFound, useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Calendar, Clock, Stethoscope, FileText, MessageSquare, CreditCard, RefreshCw, BadgeCheck } from 'lucide-react';
import Link from 'next/link';
import { mockPatients } from '@/components/doctor/patient-list';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

export default function PatientDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

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

  const handleMarkAsComplete = () => {
    const updatedPatients = allPatients.map(p => {
      if (p.id === id) {
        return { ...p, status: 'done', refundStatus: 'Processing' };
      }
      return p;
    });

    setAllPatients(updatedPatients);
    // Persist changes to session storage to simulate a database update
    sessionStorage.setItem('mockPatients', JSON.stringify(updatedPatients));

    toast({
        title: "Consultation Complete",
        description: `Refund for ₹${patient?.consultationFee} has been initiated.`,
    });
  };

  if (!patient) {
    // This can happen if the page is loaded directly and state is not yet synced.
    // A loading state or a redirect could be useful here in a real app.
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
                  <span>{isClient ? format(new Date(patient.appointmentDate), 'EEEE, MMMM d, yyyy') : ''}</span>
                </div>
                <div className="flex items-center text-muted-foreground gap-3">
                  <Clock className="w-5 h-5 text-primary"/> 
                  <span>{isClient ? format(new Date(patient.appointmentDate), 'p') : ''}</span>
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
            </CardContent>
             {patient.status === 'upcoming' && (
                <CardFooter className="bg-slate-50/70 mt-6 py-4 px-6 border-t">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="lg">
                               <BadgeCheck className="mr-2"/> Mark as Complete & Initiate Refund
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will mark the consultation as complete and initiate a refund of ₹{patient.consultationFee.toFixed(2)} to the patient's original payment method. This action cannot be undone.
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
