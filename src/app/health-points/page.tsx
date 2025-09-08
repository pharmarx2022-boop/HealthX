
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Wallet, PercentCircle, Stethoscope } from 'lucide-react';

const earningSteps = [
    {
        icon: Stethoscope,
        title: "Complete a Doctor's Visit",
        description: "Book an appointment with any doctor on the HealthX platform and complete your consultation.",
    },
    {
        icon: Gift,
        title: "Receive a 100% Bonus",
        description: "After the doctor marks your visit as complete, we credit your wallet with Health Points equal to 100% of the consultation fee you paid.",
    },
];

const spendingSteps = [
     {
        icon: PercentCircle,
        title: "Visit a Partner Lab or Pharmacy",
        description: "Find any of our partner labs or pharmacies that display the 'Accepts Health Points' badge.",
    },
    {
        icon: Wallet,
        title: "Redeem for Instant Discounts",
        description: "Show your HealthX profile at checkout. The partner will help you redeem your points for a discount on your total bill.",
    },
]

export default function HealthPointsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Health Points Explained</h1>
                <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
                    Your guide to earning and spending rewards on the HealthX platform.
                </p>
            </div>
             <Card className="max-w-2xl mx-auto shadow-lg mb-12">
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">The core value of our program is simple:</p>
                    <p className="text-3xl font-bold text-primary">1 Health Point = 1 Indian Rupee</p>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-12">
                <section>
                    <h2 className="text-2xl md:text-3xl font-headline font-bold text-center mb-8">How to Earn Points</h2>
                     <div className="space-y-8">
                        {earningSteps.map((step, index) => (
                             <Card key={step.title} className="shadow-sm">
                                <CardHeader className="flex flex-row items-center gap-4">
                                     <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shrink-0 font-bold text-xl">
                                        {index + 1}
                                    </div>
                                    <div className="flex-grow">
                                        <CardTitle>{step.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pl-20">
                                    <p className="text-muted-foreground">{step.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
                 <section>
                     <h2 className="text-2xl md:text-3xl font-headline font-bold text-center mb-8">How to Spend Points</h2>
                     <div className="space-y-8">
                        {spendingSteps.map((step, index) => (
                             <Card key={step.title} className="shadow-sm">
                                <CardHeader className="flex flex-row items-center gap-4">
                                     <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shrink-0 font-bold text-xl">
                                        {index + 1}
                                    </div>
                                    <div className="flex-grow">
                                        <CardTitle>{step.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pl-20">
                                    <p className="text-muted-foreground">{step.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
