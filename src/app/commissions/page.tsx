
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgePercent, Users, Banknote, Calendar, Pill, Beaker } from 'lucide-react';

const commissionDetails = [
    {
        icon: Calendar,
        role: "Health Coordinators",
        detail: "Earn a 5% commission on the consultation fee for every appointment you book that is successfully completed by the patient.",
    },
    {
        icon: Pill,
        role: "Pharmacies & Labs",
        detail: "Earn a 5% commission on the value of Health Points redeemed by patients at your establishment for their bill payments.",
    }
];

const referralDetails = [
    {
        icon: Users,
        title: "Refer & Earn",
        description: "Invite new partners (Health Coordinators, Labs, or Pharmacies) to join HealthX using your unique referral code.",
    },
    {
        icon: Banknote,
        title: "Unlock Your Bonus",
        description: "Once the partner you referred achieves their first activity milestone (e.g., a certain number of bookings or transactions), you receive a one-time cash bonus in your commission wallet.",
    }
]

export default function CommissionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Commissions & Referrals</h1>
                <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
                    Understand how you can grow your earnings as a HealthX partner.
                </p>
            </div>

            <section className="mb-16">
                <h2 className="text-2xl md:text-3xl font-headline font-bold text-center mb-8">Earning Commissions</h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {commissionDetails.map(item => (
                        <Card key={item.role} className="shadow-lg">
                            <CardHeader className="text-center items-center">
                                <div className="p-4 bg-primary/10 rounded-full mb-4">
                                    <item.icon className="w-10 h-10 text-primary" />
                                </div>
                                <CardTitle className="font-headline text-2xl">{item.role}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-center text-muted-foreground">
                                    {item.detail}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
            
            <section>
                <h2 className="text-2xl md:text-3xl font-headline font-bold text-center mb-8">The Referral Program</h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {referralDetails.map(item => (
                        <Card key={item.title} className="shadow-lg">
                             <CardHeader className="text-center items-center">
                                <div className="p-4 bg-primary/10 rounded-full mb-4">
                                    <item.icon className="w-10 h-10 text-primary" />
                                </div>
                                <CardTitle className="font-headline text-2xl">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-center text-muted-foreground">
                                    {item.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

             <Card className="max-w-4xl mx-auto shadow-lg mt-16 bg-slate-50">
                <CardHeader>
                    <CardTitle className="text-center">Managing Your Earnings</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground space-y-2">
                    <p>All your earnings from commissions and referrals are collected in your personal **Commission Wallet** on your dashboard.</p>
                    <p>You can request a withdrawal of your balance once it reaches the minimum required threshold. All withdrawals are reviewed and processed by our admin team.</p>
                </CardContent>
            </Card>

        </div>
      </main>
      <Footer />
    </div>
  );
}
