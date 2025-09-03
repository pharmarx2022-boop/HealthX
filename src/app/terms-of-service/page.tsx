
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FloatingWhatsApp } from '@/components/layout/floating-whatsapp';

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
              
              <h2 className="text-xl font-bold text-foreground pt-4">2. Description of Service</h2>
              <p>HealthLink Hub provides a technology platform that connects users (patients, doctors, pharmacies, labs, and agents) to facilitate healthcare services, including appointment booking, health point management, and information sharing. We are not a healthcare provider.</p>

              <h2 className="text-xl font-bold text-foreground pt-4">3. User Accounts</h2>
              <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</p>
              
              <h2 className="text-xl font-bold text-foreground pt-4">4. Content</h2>
              <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.</p>
              
              <h2 className="text-xl font-bold text-foreground pt-4">5. Limitation Of Liability</h2>
              <p>In no event shall HealthLink Hub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
              
              <h2 className="text-xl font-bold text-foreground pt-4">6. Changes</h2>
              <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
