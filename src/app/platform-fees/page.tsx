
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, User, Briefcase, Sparkles, CircleOff, Percent } from 'lucide-react';

const feeDetails = [
    {
        icon: User,
        role: "For Patients",
        description: "When you book a doctor's appointment, a small, non-refundable platform fee is charged. This fee is a percentage of the doctor's consultation fee.",
        options: [
            {
                icon: Sparkles,
                title: "Opt-In for Rewards (5% Fee)",
                details: "Pay a 5% platform fee to be eligible for a 100% Health Point bonus after your visit. This is the most rewarding option."
            },
            {
                icon: CircleOff,
                title: "Opt-Out of Rewards (0% Fee)",
                details: "If you choose not to receive Health Points for a visit, no platform fee is charged. You still get your 100% cash refund."
            }
        ]
    },
    {
        icon: Briefcase,
        role: "For Partners",
        description: "When a partner (like a Health Coordinator) books for a patient, the fee structure ensures they earn a commission.",
         options: [
            {
                icon: Percent,
                title: "Booking Fee (5-10%)",
                details: "The fee is either 5% or 10% of the consultation fee, depending on whether the patient opts-in for Health Points. This fee covers the partner's 5% commission."
            },
             {
                icon: Banknote,
                title: "No Other Fees",
                details: "Partners (Doctors, Labs, Pharmacies) do not pay any fees to join or use the HealthX platform. Our model is built on shared success."
            }
        ]
    }
]

export default function PlatformFeesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Platform Fees</h1>
                <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
                    We believe in transparency. Here’s a clear breakdown of our platform fees.
                </p>
            </div>
            
            <Card className="max-w-3xl mx-auto shadow-lg mb-12 border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Banknote className="text-primary"/> Why is there a fee?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">The platform fee is a small, non-refundable charge applied only during the appointment booking process. It's crucial for sustaining the platform, covering payment gateway costs, and funding the valuable Health Points reward system that makes healthcare more affordable for everyone. This fee is non-refundable in all situations, including cancellations.</p>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {feeDetails.map(section => (
                    <Card key={section.role} className="shadow-sm h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3"><section.icon/> {section.role}</CardTitle>
                            <CardDescription>{section.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {section.options.map(option => (
                                <div key={option.title} className="p-3 bg-slate-50 rounded-lg border">
                                    <h4 className="font-semibold flex items-center gap-2"><option.icon className="w-4 h-4 text-primary"/> {option.title}</h4>
                                    <p className="text-sm text-muted-foreground mt-1 pl-6">{option.details}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
