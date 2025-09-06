
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
            <div className="space-y-6 text-muted-foreground">
              <p><strong>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
              
              <p>HealthLink Hub ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and mobile application (collectively, the "Platform"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the platform.</p>
              
              <p className="border-l-4 border-primary pl-4 italic">This document is a template and not legal advice. You must consult with a qualified legal professional to ensure your Privacy Policy is compliant with all applicable laws, including the Information Technology Act, 2000 and the (Indian) Contract Act, 1872.</p>
              
              <h2 className="text-xl font-bold text-foreground pt-4">1. Information We Collect</h2>
              <p>We may collect information about you in a variety of ways. The information we may collect on the Platform includes:</p>
              
              <h3 className="text-lg font-semibold text-foreground pt-2">Personal Data</h3>
              <p>Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Platform or when you choose to participate in various activities related to the Platform, such as online chat and message boards.</p>

              <h3 className="text-lg font-semibold text-foreground pt-2">Sensitive Personal Data or Information (SPDI)</h3>
              <p>As a healthcare platform, we may collect information that is considered "Sensitive Personal Data or Information" under the Information Technology (Reasonable security practices and procedures and sensitive personal data or information) Rules, 2011. This includes:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Passwords for your account on our Platform.</li>
                <li>Financial information such as bank account or credit card or debit card or other payment instrument details provided during transactions.</li>
                <li>Physical, physiological and mental health condition.</li>
                <li>Sexual orientation.</li>
                <li>Medical records and history.</li>
                <li>Biometric information.</li>
                <li>Any detail relating to the above clauses as provided to us for providing service.</li>
                <li>Any of the information received under the above clauses by us for processing, stored or processed under lawful contract or otherwise.</li>
              </ul>
              <p>For specific user roles, this may include:</p>
               <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>For Patients:</strong> Health concerns, appointment details, medical reports you upload, and information about family members you add for booking purposes.</li>
                <li><strong>For Doctors, Labs, and Pharmacies (Partners):</strong> Professional registration numbers and copies of registration certificates for verification.</li>
                <li><strong>For Health Coordinators:</strong> Aadhar number and images of your Aadhar card for verification.</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-foreground pt-2">Derivative Data</h3>
              <p>Information our servers automatically collect when you access the Platform, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Platform.</p>

              <h2 className="text-xl font-bold text-foreground pt-4">2. Use of Your Information</h2>
              <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Platform to:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Create and manage your account.</li>
                <li>Verify the identity and credentials of our Partners and Health Coordinators to maintain a trustworthy ecosystem.</li>
                <li>Facilitate appointment bookings and communication between patients and healthcare providers.</li>
                <li>Process payments, refunds, rewards (Health Points), and commissions, including sharing necessary details with our payment gateway providers.</li>
                <li>Email you regarding your account or order.</li>
                <li>Generate a personal profile about you to make future visits to the Platform more personalized.</li>
                <li>Increase the efficiency and operation of the Platform.</li>
                <li>Monitor and analyze usage and trends to improve your experience with the Platform.</li>
                <li>Notify you of updates to the Platform.</li>
                <li>Send you notifications related to your account activity, such as booking confirmations, OTPs for security, and reminders.</li>
                <li>Request feedback and contact you about your use of the Platform.</li>
                <li>Resolve disputes and troubleshoot problems.</li>
                <li>Respond to product and customer service requests.</li>
                <li>Comply with legal and regulatory requirements.</li>
              </ul>

              <h2 className="text-xl font-bold text-foreground pt-4">3. Disclosure of Your Information</h2>
              <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
              <h3 className="text-lg font-semibold text-foreground pt-2">By Law or to Protect Rights</h3>
              <p>If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation. This includes exchanging information with other entities for fraud protection and credit risk reduction.</p>

              <h3 className="text-lg font-semibold text-foreground pt-2">Third-Party Service Providers</h3>
              <p>We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</p>
              
              <h3 className="text-lg font-semibold text-foreground pt-2">Interactions with Other Users</h3>
               <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Public Profiles:</strong> Information provided by Partners (Doctors, Labs, Pharmacies) for their public profile is visible to all users to enable them to find and select services.</li>
                <li><strong>With Healthcare Providers:</strong> When a patient books an appointment, we share necessary information with the chosen provider to facilitate the consultation.</li>
                 <li><strong>For Administrative Purposes:</strong> Verification documents such as registration certificates and Aadhar cards are accessible only to our administrative team for the purpose of approving accounts. They are never shared publicly or with other users.</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground pt-2">Business Transfers</h3>
              <p>We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</p>
              
              <h2 className="text-xl font-bold text-foreground pt-4">4. Security of Your Information</h2>
              <p>We use administrative, technical, and physical security measures to help protect your personal information. We have implemented reasonable security practices and procedures as mandated under the Information Technology Act, 2000 and the Information Technology (Reasonable security practices and procedures and sensitive personal data or information) Rules, 2011. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

              <h2 className="text-xl font-bold text-foreground pt-4">5. Your Rights Regarding Your Information</h2>
              <p>You have the right to access, correct, and update the information you have provided to us. You can review and change your information by logging into your account and visiting your profile page. You may also contact us to request the deletion of your account and personal information, but be aware that some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Service and/or comply with legal requirements.</p>

              <h2 className="text-xl font-bold text-foreground pt-4">6. Policy for Children</h2>
              <p>We do not knowingly solicit information from or market to children under the age of 18. If you become aware of any data we have collected from children under age 18, please contact us using the contact information provided below. A parent or guardian may add a minor to their family profile, in which case the parent or guardian is responsible for providing and managing that information.</p>
              
              <h2 className="text-xl font-bold text-foreground pt-4">7. Grievance Officer</h2>
              <p>In accordance with the Information Technology Act 2000 and rules made thereunder, the name and contact details of the Grievance Officer are provided below:</p>
              <p>[Name of Grievance Officer]<br/>[Designation]<br/>[Email Address]<br/>[Contact Number]</p>
              <p>Please contact the Grievance Officer for any questions or concerns about this policy or your information.</p>

              <h2 className="text-xl font-bold text-foreground pt-4">8. Changes to This Privacy Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on the Platform. You are advised to review this Privacy Policy periodically for any changes.</p>

              <h2 className="text-xl font-bold text-foreground pt-4">9. Contact Us</h2>
              <p>If you have questions or comments about this Privacy Policy, please contact us through the "Contact Us" page on our website.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
