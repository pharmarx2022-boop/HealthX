
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
            <div className="space-y-6 text-muted-foreground">
              <p><strong>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
              
              <p className="border-l-4 border-primary pl-4 italic">This document is a template and not legal advice. You must consult with a qualified legal professional to ensure your Terms of Service are compliant with all applicable laws, including the Information Technology Act, 2000 and the (Indian) Contract Act, 1872.</p>

              <h2 className="text-xl font-bold text-foreground pt-4">1. Agreement to Terms</h2>
              <p>By using our platform, HealthX ("Platform"), you agree to be bound by these Terms of Service ("Terms"). This constitutes a legally binding agreement between you and HealthX. If you disagree with any part of the terms, then you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service, including Patients, Doctors, Pharmacies, Labs, and Health Coordinators (collectively, "Users").</p>
              
              <h2 className="text-xl font-bold text-foreground pt-4">2. Platform Services</h2>
              <p>HealthX is a technology platform that connects Users seeking healthcare services with independent third-party healthcare providers. We do not provide healthcare services ourselves. The platform facilitates appointment booking, communication, and a rewards system. We are not responsible for the professional advice, diagnosis, treatment, or services provided by any healthcare provider on the Platform.</p>

              <h2 className="text-xl font-bold text-foreground pt-4">3. User Accounts & Registration</h2>
              <p>To access most features of the Platform, you must register for an account. When you create an account, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account. You are responsible for safeguarding the password and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>

              <h2 className="text-xl font-bold text-foreground pt-4">4. Appointment Booking, Fees & Refund Policy</h2>
                <ul className="list-disc list-inside space-y-3 pl-4">
                    <li><strong>Pre-payment as Security Deposit:</strong> To book a doctor's appointment, Patients must pre-pay the full consultation fee as listed by the doctor. This payment acts as a security deposit to confirm your slot.</li>
                    <li><strong>Refund and Reward Mechanism:</strong> After the Patient attends the appointment and the Doctor marks it as "complete" on the Platform, two things will happen: (1) A 100% cash refund of the consultation fee will be initiated to the Patient's original payment method. (2) A 100% bonus in Health Points, equivalent to the consultation fee, will be credited to the Patient's Health Point wallet.</li>
                    <li><strong>No-Show Policy:</strong> The pre-paid appointment fee will NOT be refunded if the Patient fails to attend the scheduled appointment (a "no-show"). This policy is to compensate our healthcare providers for their reserved time.</li>
                    <li><strong>Cancellations:</strong> If an appointment is canceled by the Doctor or the Platform for any reason, the Patient will receive a full refund of the pre-paid fee. Patient-initiated cancellations are subject to the Doctor's individual cancellation policy, which should be reviewed before booking.</li>
                </ul>

              <h2 className="text-xl font-bold text-foreground pt-4">5. Health Point Policy</h2>
                 <ul className="list-disc list-inside space-y-3 pl-4">
                    <li><strong>Earning:</strong> Patients earn Health Points as a promotional bonus after successfully completed doctor consultations.</li>
                    <li><strong>Value:</strong> 1 Health Point is equivalent to INR 1. Health Points have no other cash value and cannot be exchanged for cash from HealthX.</li>
                    <li><strong>Redemption:</strong> Health Points can be used to pay for a percentage of services at participating partner Labs and Pharmacies. Each partner independently sets their own discount rate. To redeem points, the partner will initiate the transaction on the Platform, and the Patient must confirm it by providing a secure One-Time Password (OTP) sent to their registered mobile number/device.</li>
                </ul>

              <h2 className="text-xl font-bold text-foreground pt-4">6. Referral Commission Policy</h2>
                 <ul className="list-disc list-inside space-y-3 pl-4">
                    <li><strong>Eligibility:</strong> Registered Partners (Doctors, Labs, Pharmacies) and Health Coordinators receive a unique referral code. You earn a commission when a new partner signs up using your code and meets their first performance milestone as defined by the Platform.</li>
                    <li><strong>Commission Wallet:</strong> All earned referral commissions are credited in INR to your "Commission Wallet" on the Platform.</li>
                    <li><strong>Withdrawal:</strong> You can request to withdraw your commission balance. A minimum balance of INR 1000 is required to make a withdrawal request. All requests are subject to review and approval by our administrators. We are not responsible for any delays in processing payments due to incorrect bank details provided by the user.</li>
                </ul>

              <h2 className="text-xl font-bold text-foreground pt-4">7. Obligations of Healthcare Providers and Partners</h2>
              <p>By registering as a Doctor, Lab, Pharmacy, or Health Coordinator, you represent and warrant that you hold all necessary licenses, approvals, and authority to provide the services you offer. You agree to maintain the accuracy of your profile information and to provide services to Patients in a professional and ethical manner, consistent with industry standards and applicable laws.</p>

              <h2 className="text-xl font-bold text-foreground pt-4">8. Intellectual Property</h2>
              <p>The Platform and its original content, features, and functionality are and will remain the exclusive property of HealthX and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of HealthX.</p>
              
              <h2 className="text-xl font-bold text-foreground pt-4">9. Limitation Of Liability</h2>
              <p>In no event shall HealthX, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service, including any medical advice or treatment from a healthcare provider; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.</p>

              <h2 className="text-xl font-bold text-foreground pt-4">10. Indemnification</h2>
              <p>You agree to defend, indemnify and hold harmless HealthX and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not to attorney's fees), resulting from or arising out of a) your use and access of the Service, by you or any person using your account and password, or b) a breach of these Terms.</p>
              
              <h2 className="text-xl font-bold text-foreground pt-4">11. Governing Law & Jurisdiction</h2>
              <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in [Your City, e.g., Mumbai, Maharashtra], India.</p>

              <h2 className="text-xl font-bold text-foreground pt-4">12. Changes to Terms</h2>
              <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
