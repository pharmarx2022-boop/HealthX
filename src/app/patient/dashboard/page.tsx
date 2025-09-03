
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { User, Calendar, Clock, Stethoscope, IndianRupee, RefreshCw, Bell, Star, Users, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';
import { mockPatients } from '@/components/doctor/patient-list';
import { initialDoctors } from '@/lib/mock-data';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FamilyManager } from '@/components/patient/family-manager';

const DOCTORS_KEY = 'doctorsData';

export default function PatientDashboardPage() {
    const { toast } = useToast();
    const [myAppointments, setMyAppointments] = useState<any[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        setIsClient(true);
        // In a real app, you'd fetch this for the logged-in user.
        // Here, we'll use the persisted mock data and filter it.
        const storedPatients = sessionStorage.getItem('mockPatients');
        const allAppointments = storedPatients ? JSON.parse(storedPatients) : mockPatients;
        // Let's assume the logged in patient is "Rohan Sharma" for this demo
        setMyAppointments(allAppointments.filter((p: any) => p.name === 'Rohan Sharma')); 
    }, []);

    const nextReminder = myAppointments.find(appt => appt.nextAppointmentDate);
    
    const healthPoints = myAppointments
        .filter(appt => appt.status === 'done' && appt.refundStatus === 'Refunded')
        .reduce((total, appt) => total + appt.consultationFee, 0);

    const openReviewDialog = (appointment: any) => {
        setSelectedAppointment(appointment);
        setIsReviewOpen(true);
        setRating(0);
        setComment('');
    };
    
    const handleSubmitReview = () => {
        if (rating === 0 || !comment) {
            toast({
                title: "Incomplete Review",
                description: "Please provide a rating and a comment.",
                variant: "destructive",
            });
            return;
        }

        const storedDoctors = sessionStorage.getItem(DOCTORS_KEY);
        let doctors = storedDoctors ? JSON.parse(storedDoctors) : initialDoctors;

        const doctorId = selectedAppointment?.doctorId ?? '1'; // Default to doctor 1 for demo
        
        const updatedDoctors = doctors.map((doc: any) => {
            if (doc.id === doctorId) {
                const newReview = {
                    patientName: "Rohan Sharma", // Hardcoded for demo
                    rating,
                    comment,
                };
                const newReviewsList = [...(doc.reviewsList || []), newReview];
                return { ...doc, reviewsList: newReviewsList };
            }
            return doc;
        });
        
        sessionStorage.setItem(DOCTORS_KEY, JSON.stringify(updatedDoctors));
        
        // Also update the appointment to prevent another review
        const updatedAppointments = myAppointments.map(appt => 
            appt.id === selectedAppointment.id ? { ...appt, reviewed: true } : appt
        );
        const allStoredAppointments = JSON.parse(sessionStorage.getItem('mockPatients') || '[]');
        const finalAppointments = allStoredAppointments.map((appt: any) => {
            if (appt.id === selectedAppointment.id) {
                return { ...appt, reviewed: true };
            }
            return appt;
        });

        sessionStorage.setItem('mockPatients', JSON.stringify(finalAppointments));
        setMyAppointments(updatedAppointments);

        toast({
            title: "Review Submitted!",
            description: "Thank you for your feedback.",
        });

        setIsReviewOpen(false);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-slate-50/50">
                <div className="container mx-auto py-12">
                    <div className="mb-8">
                        <h1 className="text-3xl font-headline font-bold">Patient Dashboard</h1>
                        <p className="text-muted-foreground">Manage your appointments and health records.</p>
                    </div>

                    {isClient && nextReminder && (
                        <Alert className="mb-8 bg-primary/10 border-primary/20 text-primary-foreground">
                            <Bell className="h-5 w-5 text-primary"/>
                            <AlertTitle className="font-bold text-primary">Next Appointment Reminder</AlertTitle>
                            <AlertDescription className="text-primary/80">
                                Your doctor has scheduled a follow-up for you on{' '}
                                <strong className="font-semibold">{format(new Date(nextReminder.nextAppointmentDate), 'EEEE, MMMM d, yyyy')}</strong>.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                             <Card className="shadow-sm">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <User className="w-8 h-8 text-primary" />
                                    <div>
                                        <CardTitle>Welcome, Rohan Sharma!</CardTitle>
                                        <CardDescription>
                                            Book new appointments, view your upcoming visits, and track your refunds.
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>
                                    <div className="space-y-6">
                                        {isClient && myAppointments.length > 0 ? (
                                            myAppointments.map(appt => (
                                                <Card key={appt.id} className="overflow-hidden">
                                                    <CardHeader className="flex flex-row justify-between items-start bg-slate-50/70 p-4">
                                                        <div>
                                                            <CardTitle className="text-lg font-headline">Consultation at {appt.clinic}</CardTitle>
                                                            <CardDescription className="flex items-center gap-2 pt-1">
                                                                <Calendar className="w-4 h-4"/> {format(new Date(appt.appointmentDate), 'EEEE, MMMM d, yyyy')}
                                                                <Clock className="w-4 h-4 ml-2"/> {format(new Date(appt.appointmentDate), 'p')}
                                                            </CardDescription>
                                                        </div>
                                                        <Badge variant={appt.status === 'done' ? 'secondary' : 'default'} className="capitalize">{appt.status}</Badge>
                                                    </CardHeader>
                                                    <CardContent className="p-4 grid grid-cols-2 gap-4">
                                                        <div className="flex items-center text-muted-foreground gap-3">
                                                            <Stethoscope className="w-5 h-5 text-primary" />
                                                            <div>
                                                                <p className="font-medium text-foreground">Reason</p>
                                                                <p>{appt.consultation}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center text-muted-foreground gap-3">
                                                            <IndianRupee className="w-5 h-5 text-primary" />
                                                            <div>
                                                                <p className="font-medium text-foreground">Fee Paid</p>
                                                                <p>₹{appt.consultationFee.toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center text-muted-foreground gap-3 col-span-2">
                                                            <RefreshCw className="w-5 h-5 text-primary" />
                                                            <div>
                                                                <p className="font-medium text-foreground">Refund Status</p>
                                                                <p>{appt.refundStatus}</p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                    {appt.status === 'done' && (
                                                        <CardFooter className="bg-slate-50/70 p-4 border-t">
                                                            <Button variant="outline" onClick={() => openReviewDialog(appt)} disabled={appt.reviewed}>
                                                                <Star className="mr-2"/> {appt.reviewed ? 'Review Submitted' : 'Leave a Review'}
                                                            </Button>
                                                        </CardFooter>
                                                    )}
                                                </Card>
                                            ))
                                        ) : (
                                            <p>You have no upcoming appointments.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-1 space-y-8">
                             <Card className="shadow-sm">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <Wallet className="w-8 h-8 text-primary" />
                                    <div>
                                        <CardTitle>Health Points</CardTitle>
                                        <CardDescription>
                                            Your cashback rewards.
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold">₹{healthPoints.toFixed(2)}</p>
                                    <p className="text-sm text-muted-foreground mt-1">Use these points for future services.</p>
                                </CardContent>
                            </Card>
                            <Card className="shadow-sm">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <Users className="w-8 h-8 text-primary" />
                                    <div>
                                        <CardTitle>Family Members</CardTitle>
                                        <CardDescription>
                                            Manage profiles for your family.
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <FamilyManager />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />

            <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Leave a Review</DialogTitle>
                        <DialogDescription>
                            Share your experience with Dr. {initialDoctors.find(d => d.id === (selectedAppointment?.doctorId ?? '1'))?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="font-medium">Your Rating</label>
                            <div className="flex items-center gap-1 mt-2">
                                {[...Array(5)].map((_, index) => {
                                    const starValue = index + 1;
                                    return (
                                        <button key={starValue} onClick={() => setRating(starValue)}>
                                            <Star className={`w-8 h-8 cursor-pointer transition-colors ${starValue <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}/>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                        <div>
                             <label className="font-medium">Your Comments</label>
                             <Textarea 
                                className="mt-2" 
                                placeholder="Tell us about your experience..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                             />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleSubmitReview}>Submit Review</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
