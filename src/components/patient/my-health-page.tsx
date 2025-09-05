
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { User, Calendar, Clock, Stethoscope, RefreshCw, Bell, Star, Users, Wallet, History, FileText, Loader2, Store, KeyRound, Share2, Gift } from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { mockPatients } from '@/components/doctor/patient-list';
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
import { BottomNavBar } from '@/components/layout/bottom-nav-bar';

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
    const [myAppointments, setMyAppointments] = useState<any[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [user, setUser] = useState<any | null>(null);
    const [nextReminder, setNextReminder] = useState<any | null>(null);


    useEffect(() => {
        setIsClient(true);
        if(typeof window !== 'undefined') {
            const storedUser = sessionStorage.getItem('user');
            if (storedUser) {
                const u = JSON.parse(storedUser);
                setUser(u);
                
                const storedPatients = sessionStorage.getItem(PATIENTS_KEY);
                const allAppointments = storedPatients ? JSON.parse(storedPatients) : mockPatients;
                const userAppointments = allAppointments.filter((p: any) => p.id === u.id || p.name === u.fullName || (u.fullName === 'Rohan Sharma' && p.name === 'Rohan Sharma'));
                setMyAppointments(userAppointments);
                
                const reminder = userAppointments.find(appt => appt.nextAppointmentDate && !isNaN(new Date(appt.nextAppointmentDate).getTime()) && new Date(appt.nextAppointmentDate) > new Date());
                setNextReminder(reminder);
            }
        }
    }, [isClient, isReviewOpen]); // Re-check appointments when review dialog closes

    const transactionHistory = useMemo(() => {
        if (!isClient || !user) return { balance: 0, transactions: [], reviewedTransactionIds: new Set() };
        const history = getTransactionHistory(user.id);
        const reviewedIds = new Set(history.transactions.filter(tx => tx.reviewed).map(tx => tx.id));
        return { ...history, reviewedTransactionIds: reviewedIds };
    }, [isClient, user, isReviewOpen]);


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

            const allStoredAppointments = JSON.parse(sessionStorage.getItem(PATIENTS_KEY) || '[]');
            const finalAppointments = allStoredAppointments.map((appt: any) => {
                if (appt.id === reviewTarget.transactionId) {
                    return { ...appt, reviewed: true };
                }
                return appt;
            });
            sessionStorage.setItem(PATIENTS_KEY, JSON.stringify(finalAppointments));
            setMyAppointments(finalAppointments.filter((p: any) => p.name === user.fullName));

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
        const shareText = `Appointment Details:\n- Patient: ${appt.name}\n- Doctor: ${doctor?.name}\n- Clinic: ${appt.clinic}\n- Date: ${format(new Date(appt.appointmentDate), 'PPP')}\n- Time: ${format(new Date(appt.appointmentDate), 'p')}\n\nBooked via HealthLink Hub.`;

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
            <div className="space-y-8 pt-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-headline font-bold">My Health</h1>
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
                        <div className="lg:col-span-2 space-y-8">
                             <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle>Your Appointments</CardTitle>
                                    <CardDescription>
                                        View your upcoming visits, and track your refunds.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
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
                                                            <p className="font-bold text-primary">INR</p>
                                                            <div>
                                                                <p className="font-medium text-foreground">Fee Paid</p>
                                                                <p>INR {appt.consultationFee.toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center text-muted-foreground gap-3 col-span-2">
                                                            <RefreshCw className="w-5 h-5 text-primary" />
                                                            <div>
                                                                <p className="font-medium text-foreground">Refund Status</p>
                                                                <p>{appt.refundStatus} (Full cash refund + Health Points bonus)</p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                    <CardFooter className="bg-slate-50/70 p-4 border-t flex justify-between">
                                                        <Button variant="outline" onClick={() => openReviewDialog({type: 'doctor', id: appt.doctorId, name: initialDoctors.find(d => d.id === appt.doctorId)?.name || 'Doctor', transactionId: appt.id})} disabled={appt.reviewed || appt.status !== 'done'}>
                                                            <Star className="mr-2"/> {appt.reviewed ? 'Review Submitted' : 'Leave a Review'}
                                                        </Button>
                                                        <Button variant="outline" onClick={() => handleShare(appt)}>
                                                            <Share2 className="mr-2"/> Share
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            ))
                                        ) : (
                                            <p>You have no upcoming appointments.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                             <MyReports />
                        </div>
                        <div className="lg:col-span-1 space-y-8">
                             <Card className="shadow-sm">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <Gift className="w-8 h-8 text-primary" />
                                    <div>
                                        <CardTitle>Health Points</CardTitle>
                                        <CardDescription>
                                            Your bonus rewards.
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold">INR {transactionHistory.balance.toFixed(2)}</p>
                                    <p className="text-sm text-muted-foreground mt-1">Available to redeem.</p>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-2">
                                    <Button variant="link" className="p-0 h-auto" onClick={() => setIsHistoryOpen(true)}>
                                        <History className="mr-2"/> View History
                                    </Button>
                                     <Alert className="text-center">
                                        <KeyRound className="h-4 w-4"/>
                                        <AlertTitle>How to Redeem?</AlertTitle>
                                        <AlertDescription>
                                            Ask any partner to initiate a redemption. You will receive an OTP on your registered mobile to confirm the payment.
                                        </AlertDescription>
                                    </Alert>
                                </CardFooter>
                            </Card>
                            <Card id="family" className="shadow-sm">
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

             {/* Transaction History Dialog */}
            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Health Points History</DialogTitle>
                        <DialogDescription>
                            A record of your earnings and redemptions.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto -mx-6 px-6">
                        <ul className="space-y-4 py-4">
                             {transactionHistory.transactions.length > 0 ? (
                                transactionHistory.transactions.map((tx) => {
                                    const isDebit = tx.type === 'debit';
                                    const canReview = isDebit && (tx.partnerType === 'lab' || tx.partnerType === 'pharmacy') && !tx.reviewed;
                                    
                                    return (
                                    <li key={tx.id} className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium">{tx.description}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{format(new Date(tx.date), 'PP, p')}</p>
                                            {canReview && (
                                                <Button 
                                                    variant="link" 
                                                    className="p-0 h-auto text-xs mt-1"
                                                    onClick={() => {
                                                        setIsHistoryOpen(false);
                                                        openReviewDialog({type: tx.partnerType!, id: tx.partnerId!, name: tx.partnerName!, transactionId: tx.id});
                                                    }}
                                                >
                                                    <Star className="mr-1 h-3 w-3" /> Leave a review
                                                </Button>
                                            )}
                                        </div>
                                        <span className={`font-semibold shrink-0 ml-4 ${tx.type === 'credit' ? 'text-green-600' : 'text-destructive'}`}>
                                            {tx.type === 'credit' ? '+' : '-'} INR {tx.amount.toFixed(2)}
                                        </span>
                                    </li>
                                    )
                                })
                             ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No transactions yet.</p>
                             )}
                        </ul>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
