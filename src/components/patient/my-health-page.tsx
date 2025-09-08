
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { User, Calendar, Clock, Stethoscope, RefreshCw, Bell, Star, Users, Wallet, History, FileText, Loader2, Store, KeyRound, Share2, Gift, Briefcase, Pill, Trash2, Beaker } from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation'
import { mockPatientData as mockPatients } from '@/lib/mock-data';
import { initialDoctors, initialLabs, initialPharmacies } from '@/lib/mock-data';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FamilyManager } from '@/components/patient/family-manager';
import { MyReports } from '@/components/patient/my-reports';
import { getTransactionHistory, type Transaction } from '@/lib/transactions';
import { getNotifications } from '@/lib/notifications';
import { NearbySearch } from '../booking/nearby-search';
import { getRemindersForPatient, deleteReminder, type HealthReminder } from '@/lib/reminders';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '../ui/separator';


const DOCTORS_KEY = 'doctorsData';
const PATIENTS_KEY = 'mockPatients';
const LABS_KEY = 'mockLabs';
const PHARMACIES_KEY = 'mockPharmacies';
const TRANSACTIONS_KEY_PREFIX = 'transactions_';


type ReviewTarget = {
    type: 'doctor' | 'lab' | 'pharmacy';
    id: string; // Doctor, Lab, or Pharmacy ID
    name: string;
    transactionId?: string; // Appointment or Transaction ID to mark as reviewed
};

export function MyHealthPage() {
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const [myAppointments, setMyAppointments] = useState<any[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [user, setUser] = useState<any | null>(null);
   
    useEffect(() => {
        setIsClient(true);
        if(typeof window !== 'undefined') {
            const storedUser = sessionStorage.getItem('user');
            if (storedUser) {
                const u = JSON.parse(storedUser);
                setUser(u);
                
                const storedPatients = sessionStorage.getItem(PATIENTS_KEY);
                const allAppointments = storedPatients ? JSON.parse(storedPatients) : mockPatients;
                const userAppointments = allAppointments.filter((p: any) => p.id === u.id || p.name === u.fullName);
                setMyAppointments(userAppointments);
            }
        }
    }, [isClient, isReviewOpen]);

    const openReviewDialog = (target: ReviewTarget) => {
        setReviewTarget(target);
        setIsReviewOpen(true);
        setRating(0);
        setComment('');
    };
    
    const handleSubmitReview = () => {
        if (!reviewTarget || rating === 0 || !comment || !user) {
            toast({
                title: "Incomplete Review",
                description: "Please provide a rating and a comment.",
                variant: "destructive",
            });
            return;
        }

        const newReview = {
            patientName: user.fullName,
            rating,
            comment,
        };

        if (reviewTarget.type === 'doctor') {
            const storedDoctors = sessionStorage.getItem(DOCTORS_KEY);
            let doctors = storedDoctors ? JSON.parse(storedDoctors) : initialDoctors;
            
            const updatedDoctors = doctors.map((doc: any) => {
                if (doc.id === reviewTarget.id) {
                    return { ...doc, reviewsList: [...(doc.reviewsList || []), newReview] };
                }
                return doc;
            });
            sessionStorage.setItem(DOCTORS_KEY, JSON.stringify(updatedDoctors));

            const allStoredAppointments = JSON.parse(sessionStorage.getItem(PATIENTS_KEY) || '[]')
            const finalAppointments = allStoredAppointments.map((appt: any) => {
                if (appt.id === reviewTarget.transactionId) {
                    return { ...appt, reviewed: true };
                }
                return appt;
            });
            sessionStorage.setItem(PATIENTS_KEY, JSON.stringify(finalAppointments));
            setMyAppointments(finalAppointments.filter((p: any) => p.id === user.id || p.name === user.fullName));

        } else {
            const key = reviewTarget.type === 'lab' ? LABS_KEY : PHARMACIES_KEY;
            const initialData = reviewTarget.type === 'lab' ? initialLabs : initialPharmacies;
            
            const storedData = sessionStorage.getItem(key);
            let partners = storedData ? JSON.parse(storedData) : initialData;

            const updatedPartners = partners.map((p: any) => {
                if (p.id === reviewTarget.id) {
                    return { ...p, reviewsList: [...(p.reviewsList || []), newReview] };
                }
                return p;
            });
            sessionStorage.setItem(key, JSON.stringify(updatedPartners));

            // Mark transaction as reviewed
            const userTransactionsKey = TRANSACTIONS_KEY_PREFIX + user.id;
            const userHistory = getTransactionHistory(user.id);
            const updatedTransactions = userHistory.transactions.map(tx => tx.id === reviewTarget.transactionId ? {...tx, reviewed: true} : tx);
            sessionStorage.setItem(userTransactionsKey, JSON.stringify(updatedTransactions));
        }

        toast({
            title: "Review Submitted!",
            description: "Thank you for your feedback.",
        });

        setIsReviewOpen(false);
        setReviewTarget(null);
    };

    const handleShare = async (appt: any) => {
        const doctor = initialDoctors.find(d => d.id === appt.doctorId);
        const shareText = `Appointment Details:\n- Patient: ${appt.name}\n- Doctor: ${doctor?.name}\n- Clinic: ${appt.clinic}\n- Date: ${format(new Date(appt.appointmentDate), 'PPP')}\n- Time: ${format(new Date(appt.appointmentDate), 'p')}\n\nBooked via HealthX.`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Your Appointment Details',
                    text: shareText,
                });
                toast({ title: 'Appointment shared successfully!' });
            } catch (error) {
                toast({ title: 'Error sharing appointment', description: 'Could not share appointment details.', variant: 'destructive' });
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareText);
                toast({ title: 'Copied to Clipboard!', description: 'Appointment details have been copied.' });
            } catch (err) {
                 toast({ title: 'Failed to Copy', description: 'Could not copy details to clipboard.', variant: 'destructive' });
            }
        }
    };

    return (
        <>
            <div className="space-y-8">
                <div className="mb-4">
                    <h1 className="text-3xl font-headline font-bold">My Health Dashboard</h1>
                    <p className="text-muted-foreground">Manage your appointments.</p>
                </div>
                
                 <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Briefcase className="w-8 h-8 text-primary"/>
                        <div>
                            <CardTitle>Book New Appointment</CardTitle>
                            <CardDescription>
                                Find doctors, labs, and pharmacies near you.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                            <NearbySearch allowedServices={['doctor', 'lab', 'pharmacy']} />
                    </CardContent>
                </Card>

                <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Calendar/> Your Appointments</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-6">
                        {isClient && myAppointments.length > 0 ? (
                            myAppointments.map(appt => (
                                <Card key={appt.id} className="overflow-hidden">
                                    <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/70 p-4">
                                        <div>
                                            <CardTitle className="text-lg font-headline">Consultation at {appt.clinic}</CardTitle>
                                            <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 pt-1">
                                                <span className="flex items-center gap-2"><Calendar className="w-4 h-4"/> {format(new Date(appt.appointmentDate), 'EEEE, MMMM d, yyyy')}</span>
                                                <span className="flex items-center gap-2"><Clock className="w-4 h-4"/> {format(new Date(appt.appointmentDate), 'p')}</span>
                                            </CardDescription>
                                        </div>
                                        <Badge variant={appt.status === 'done' ? 'secondary' : 'default'} className="capitalize mt-2 sm:mt-0">{appt.status}</Badge>
                                    </CardHeader>
                                    <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center text-muted-foreground gap-3">
                                            <Stethoscope className="w-5 h-5 text-primary shrink-0" />
                                            <div>
                                                <p className="font-medium text-foreground">Reason</p>
                                                <p>{appt.consultation}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-muted-foreground gap-3">
                                            <p className="font-bold text-primary text-lg shrink-0">INR</p>
                                            <div>
                                                <p className="font-medium text-foreground">Fee Paid</p>
                                                <p>INR {appt.consultationFee.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-muted-foreground gap-3 col-span-1 sm:col-span-2">
                                            <RefreshCw className="w-5 h-5 text-primary shrink-0" />
                                            <div>
                                                <p className="font-medium text-foreground">Refund Status</p>
                                                <p>{appt.refundStatus} (Full cash refund + Health Points bonus)</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-slate-50/70 p-4 border-t flex flex-wrap justify-between gap-2">
                                        <Button variant="outline" onClick={() => openReviewDialog({type: 'doctor', id: appt.doctorId, name: initialDoctors.find(d => d.id === appt.doctorId)?.name || 'Doctor', transactionId: appt.id})} disabled={appt.reviewed || appt.status !== 'done'}>
                                            <Star className="mr-2 h-4 w-4"/> {appt.reviewed ? 'Review Submitted' : 'Leave a Review'}
                                        </Button>
                                        <Button variant="outline" onClick={() => handleShare(appt)}>
                                            <Share2 className="mr-2 h-4 w-4"/> Share
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <p className="text-center py-8 text-muted-foreground">You have no upcoming appointments.</p>
                        )}
                     </CardContent>
                </Card>
            </div>

            {/* Review Dialog */}
            <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Leave a Review</DialogTitle>
                        <DialogDescription>
                            Share your experience with {reviewTarget?.name}.
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
        </>
    );
}
