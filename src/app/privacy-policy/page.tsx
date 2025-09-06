
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-16">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
            <h1 className="text-3xl font-headline font-bold mb-6">Privacy Policy for HealthLink Hub</h1>
            <div className="space-y-4 text-muted-foreground">
              <p><strong>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
              
              <h2 className="text-xl font-bold text-foreground pt-4">1. Introduction</h2>
              <p>Welcome to HealthLink Hub ("we," "our," "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. By using our services, you agree to the collection and use of information in accordance with this policy.</p>
              
              <h2 className="text-xl font-bold text-foreground pt-4">2. Information We Collect</h2>
              <p>We collect information that you provide directly to us, as well as information that is automatically collected when you use our services. The type of information we collect depends on your role on our platform.</p>
              <ul className="list-disc list-inside space-y-3 pl-4">
                <li>
                  <strong>For All Users:</strong> We collect basic account information such as your name, email address, and phone number when you register.
                </li>
                <li>
                  <strong>For Patients:</strong> We collect information necessary to facilitate healthcare services, including appointment details, health concerns, medical reports you choose to upload, and details of family members you add to your profile for booking purposes.
                </li>
                <li>
                  <strong>For Doctors, Labs, and Pharmacies (Partners):</strong> We collect professional information to create your public profile, such as your specialty, location, experience, and consultation fees. For verification purposes, we also require your official registration number and a copy of your registration certificate. This verification data is used solely for administrative review and is not displayed publicly.
                </li>
                 <li>
                  <strong>For Health Coordinators:</strong> For verification and security, we collect your Aadhar number and images of the front and back of your Aadhar card. This information is strictly for administrative approval and is not shared publicly.
                </li>
              </ul>
              
              <h2 className="text-xl font-bold text-foreground pt-4">3. How We Use Your Information</h2>
              <p>We use the information we collect for various purposes, including to:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Create and manage your account and public profiles (for Partners).</li>
                <li>Verify the identity and credentials of our Partners and Health Coordinators.</li>
                <li>Facilitate appointment bookings and communication between patients and healthcare providers.</li>
                <li>Process payments, refunds, rewards (Health Points), and commissions.</li>
                <li>Send you notifications related to your account activity, such as booking confirmations and OTPs for security.</li>
                <li>Improve and personalize our services.</li>
              </ul>

               <h2 className="text-xl font-bold text-foreground pt-4">4. Sharing of Your Information</h2>
              <p>We understand the sensitivity of your information and share it only in the following circumstances:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>With Healthcare Providers:</strong> When a patient books an appointment, we share necessary information (like name and reason for visit) with the chosen doctor to facilitate the consultation.</li>
                <li><strong>Public Profiles:</strong> Information provided by Partners for their public profile (e.g., name, specialty, clinic location) is visible to all users of the platform to enable them to find and select services.</li>
                <li><strong>For Administrative Purposes:</strong> Verification documents such as registration certificates and Aadhar cards are accessible only to our administrative team for the purpose of approving accounts. They are never shared publicly or with other users.</li>
                 <li><strong>With Your Consent:</strong> We may share your information for other purposes with your explicit consent.</li>
              </ul>
              
              <h2 className="text-xl font-bold text-foreground pt-4">5. Security of Your Information</h2>
              <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
              
              <h2 className="text-xl font-bold text-foreground pt-4">6. Contact Us</h2>
              <p>If you have questions or comments about this Privacy Policy, please contact us through the "Contact Us" page on our website.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
