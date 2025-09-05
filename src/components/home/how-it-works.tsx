
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Book, Stethoscope, RefreshCw, ShoppingCart, Wallet, Gift } from "lucide-react";

const steps = [
    {
        icon: Book,
        title: "1. Pre-Pay to Book Slot",
        description: "Pay the consultation fee online as a fully refundable security deposit to reserve your appointment.",
    },
    {
        icon: Stethoscope,
        title: "2. Visit The Doctor",
        description: "Attend your consultation as scheduled. There are no hidden fees to be paid at the clinic.",
    },
    {
        icon: RefreshCw,
        title: "3. Get a Full Refund",
        description: "After the doctor marks your visit as complete, your initial deposit is fully refunded to your original payment method.",
    },
    {
        icon: Gift,
        title: "4. Earn Health Points",
        description: "As a bonus, you also get 100% of the consultation fee back as valuable Health Points to use on other services.",
    }
]

export function HowItWorks() {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">A Rewarding Healthcare Experience</h2>
                    <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
                        Our unique process gives you a 100% cash refund AND a 100% Health Point bonus on every consultation.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step) => (
                        <Card key={step.title} className="text-center p-6 border-2 border-transparent hover:border-primary hover:shadow-lg transition-all">
                           <CardHeader className="items-center">
                                <div className="p-4 bg-primary/10 rounded-full mb-4">
                                    <step.icon className="w-10 h-10 text-primary" />
                                </div>
                                <CardTitle className="font-headline text-xl">{step.title}</CardTitle>
                                <CardDescription className="pt-2">{step.description}</CardDescription>
                           </CardHeader>
                        </Card>
                    ))}
                </div>
                 <div className="text-center mt-12">
                    <p className="text-xl font-semibold">
                       That's right - you get your money back AND you get points to spend on other healthcare needs.
                    </p>
                </div>
            </div>
        </section>
    )
}
