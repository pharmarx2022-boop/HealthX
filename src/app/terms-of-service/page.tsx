
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-16">
           <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
            <h1 className="text-3xl font-headline font-bold mb-6">Terms of Service</h1>
            <div className="space-y-4 text-muted-foreground">
              <p><strong>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
              
              <h2 className="text-xl font-bold text-foreground pt-4">1. Agreement to Terms</h2>
              <p>By using our platform, HealthLink Hub, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service. This is a legally binding agreement.</p>
              
              <h2 className="text-xl font-bold text-foreground pt-4">2. Appointment Fee & Refund Policy</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Pre-payment as Security:</strong> When booking a doctor's appointment, you pre-pay the full consultation fee. This payment acts as a security deposit to confirm your slot with the doctor.</li>
                    <li><strong>Automatic Full Refund:</strong> After you attend your appointment and the doctor marks it as "complete," you will receive a 100% cash refund of the consultation fee, sent back to your original payment method. This is in addition to the 100% Health Point bonus you receive.</li>
                    <li><strong>When a Refund is NOT Issued:</strong> The pre-paid appointment fee will not be refunded if you fail to attend your scheduled appointment (i.e., a "no-show"). This policy is in place to protect our doctors' time and ensure the availability of slots for other patients. If an appointment is canceled by the doctor or the platform, you will always receive a full refund.</li>
                </ul>

              <h2 className="text-xl font-bold text-foreground pt-4">3. Health Point Policy</h2>
                 <ul className="list-disc list-inside space-y-2">
                    <li><strong>Earning Health Points:</strong> Patients earn a 100% bonus in Health Points after every successfully completed doctor consultation. The number of points earned is equal to the consultation fee paid (e.g., a ₹500 fee earns 500 Health Points).</li>
                    <li><strong>Value:</strong> 1 Health Point is equivalent to ₹1.</li>
                    <li><strong>Redeeming Health Points:</strong> Health Points can be used to pay for a percentage of services at participating partner labs and pharmacies. Each partner sets their own discount rate. To redeem, the partner will initiate the transaction, and you must confirm it by providing a secure One-Time Password (OTP) sent to your device.</li>
                </ul>

              <h2 className="text-xl font-bold text-foreground pt-4">4. Referral Commission Policy</h2>
                 <ul className="list-disc list-inside space-y-2">
                    <li><strong>Earning Commissions:</strong> Registered partners (Doctors, Labs, Pharmacies) and Health Coordinators receive a unique referral code. You earn a commission when a new partner you referred signs up with your code and meets their first performance milestone.</li>
                    <li><strong>Commission Wallet:</strong> All earned referral commissions are credited to your "Commission Wallet" in INR.</li>
                    <li><strong>Withdrawal:</strong> You can request to withdraw your commission balance at any time from your dashboard. A minimum balance of ₹1000 is required before a withdrawal request can be made. All withdrawal requests are reviewed and processed by an administrator.</li>
                </ul>

              <h2 className="text-xl font-bold text-foreground pt-4">5. User Accounts</h2>
              <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</p>
              
              <h2 className="text-xl font-bold text-foreground pt-4">6. Limitation Of Liability</h2>
              <p>In no event shall HealthLink Hub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
              
              <h2 className="text-xl font-bold text-foreground pt-4">7. Changes</h2>
              <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
