
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Book, Stethoscope, RefreshCw, ShoppingCart } from "lucide-react";

const steps = [
    {
        icon: Book,
        title: "1. Book & Pay a Deposit",
        description: "Find your doctor and book an appointment by paying a fully refundable security deposit online. This confirms your slot, and no cash payment is needed at the clinic.",
    },
    {
        icon: Stethoscope,
        title: "2. Consult The Doctor",
        description: "Attend your scheduled appointment. Once the doctor marks your consultation as complete, the magic begins.",
    },
    {
        icon: RefreshCw,
        title: "3. Get 100% Cashback + Points",
        description: "You receive a 100% refund of your deposit to your original payment method, PLUS an equal amount credited to your account as Health Points.",
    },
    {
        icon: ShoppingCart,
        title: "4. Redeem Health Points",
        description: "Use your Health Points like real cash to get discounts on medicines and lab tests at our partner pharmacies and labs.",
    }
]

export function HowItWorks() {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">Effectively a Free Doctor's Visit</h2>
                    <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
                        Our unique cashback and points system rewards you for taking care of your health. Here's how simple it is.
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
                       This means every consultation fee you pay comes back to you in full, with bonus points to spend.
                    </p>
                </div>
            </div>
        </section>
    )
}
