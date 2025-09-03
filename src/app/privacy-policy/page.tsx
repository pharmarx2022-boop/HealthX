
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FloatingWhatsApp } from '@/components/layout/floating-whatsapp';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-16">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
            <h1 className="text-3xl font-headline font-bold mb-6">Privacy Policy</h1>
            <div className="space-y-4 text-muted-foreground">
              <p><strong>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
              
              <h2 className="text-xl font-bold text-foreground pt-4">1. Introduction</h2>
              <p>Welcome to HealthLink Hub. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</p>
              
              <h2 className="text-xl font-bold text-foreground pt-4">2. Collection of Your Information</h2>
              <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
                <li><strong>Health Information:</strong> To provide our services, we may collect health-related information that you provide, such as medical history, consultation details, and lab reports. This information is treated with the highest level of confidentiality.</li>
                <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
              </ul>
              
              <h2 className="text-xl font-bold text-foreground pt-4">3. Use of Your Information</h2>
              <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Create and manage your account.</li>
                <li>Facilitate appointment bookings and communications between you and healthcare providers.</li>
                <li>Process payments and refunds.</li>
                <li>Email you regarding your account or order.</li>
                <li>Increase the efficiency and operation of the Site.</li>
              </ul>
              
              <h2 className="text-xl font-bold text-foreground pt-4">4. Security of Your Information</h2>
              <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
              
              <h2 className="text-xl font-bold text-foreground pt-4">5. Contact Us</h2>
              <p>If you have questions or comments about this Privacy Policy, please contact us using the contact form on our website.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
