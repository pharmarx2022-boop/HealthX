
'use client';

// This file simulates a database for storing site-wide content.

export type SiteContent = {
  vision: string;
  mission: string;
  terms: string;
  privacy: string;
};

const CONTENT_KEY = 'siteContent';

const defaultContent: SiteContent = {
  vision: `To create a world where quality healthcare is simple, accessible, and financially rewarding for everyone. We envision a connected digital ecosystem that empowers patients and providers alike, fostering a healthier future for all communities.`,
  mission: `To seamlessly connect patients with doctors, pharmacies, and labs on a single, intuitive platform. We are on a mission to revolutionize the healthcare experience through our unique cash-refund and Health Point rewards system, making every interaction within the HealthX ecosystem both valuable and convenient.`,
  terms: `## 1. Agreement to Terms
By using our platform, HealthX ("Platform"), you agree to be bound by these Terms of Service ("Terms"). This constitutes a legally binding agreement between you and HealthX.

## 2. Platform Services
HealthX is a technology platform that connects Users seeking healthcare services with independent third-party healthcare providers. We do not provide healthcare services ourselves and are not responsible for the medical advice or services rendered by the providers on our platform.

## 3. User Accounts & Registration
To access most features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process. You are responsible for safeguarding your password and for any activities or actions under your account.

## 4. Appointment Booking, Fees & Refund Policy
- **Security Deposit:** To book a doctor's appointment, Patients must pre-pay the full consultation fee as a security deposit. A non-refundable Platform Fee may also be applicable.
- **In-Clinic Payment:** The patient is required to pay the full consultation fee directly to the doctor or clinic at the time of the appointment.
- **Refund and Reward Mechanism:** After the Patient attends the appointment and the Doctor marks it as "complete", a 100% refund of the security deposit is initiated to the patient's original payment method. If opted-in, a 100% bonus in Health Points is also credited to the patient's wallet.
- **No-Show Policy:** If a patient fails to attend the scheduled appointment without prior cancellation, the security deposit will be forfeited and will not be refunded. This is to compensate the doctor for their reserved time.
- **Cancellations:** Appointments canceled by the doctor or the platform will result in a full refund of the security deposit and any platform fees paid.

## 5. Health Point Policy
- **Earning:** Patients may earn Health Points as a promotional bonus for completing certain actions, such as a doctor's consultation.
- **Value:** 1 Health Point is equivalent to INR 1 for redemption purposes on the Platform.
- **Redemption:** Health Points can be used to pay for a percentage of services at participating partner Labs and Pharmacies. Health Points are non-transferable and have no cash value outside the Platform.

## 6. Grievance Redressal
In accordance with the Information Technology Act 2000 and rules made thereunder, the name and contact details of the Grievance Officer are provided below. For any grievances, you may contact:
- **Name:** [Grievance Officer Name]
- **Email:** [grievance-officer@healthx.com]
- **Address:** [Company Address, India]`,
  privacy: `## 1. Information We Collect
We collect information to provide and improve our services. Depending on your role, this may include:
- **Personal Information:** Name, email address, phone number, date of birth, gender.
- **Sensitive Personal Data (SPD):**
  - For Patients: Medical history, reports, appointment details.
  - For Health Coordinators: Aadhar number and images for verification.
  - For Doctors, Labs, and Pharmacies: Medical or business registration number and certificate for verification.
- **Transactional Information:** Details about payments, Health Point transactions, and commission earnings.

## 2. Use of Your Information
Having accurate information permits us to provide a smooth, efficient, and customized experience. We may use your information to:
- Create and manage your account and facilitate your use of the platform.
- Facilitate appointment bookings and communications between users.
- Process payments, refunds, and commissions.
- Credit and manage Health Points.
- Comply with legal and regulatory obligations.

## 3. Disclosure of Your Information
We do not sell your personal data. We may share information in the following situations:
- **With Your Consent:** E.g., sharing your details with a doctor when you book an appointment.
- **To Service Providers:** With vendors who perform services for us, such as payment gateways, under strict confidentiality agreements.
- **For Legal Reasons:** If required by law or to protect the rights and safety of our users and the public.

## 4. Data Security
We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect or impenetrable.

## 5. Grievance Officer
For any queries or grievances related to our Privacy Policy or the processing of your personal information, please contact our Grievance Officer:
- **Name:** [Grievance Officer Name]
- **Email:** [grievance-officer@healthx.com]
- **Address:** [Company Address, India]`,
};


export async function getContent(): Promise<SiteContent> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      const storedContent = localStorage.getItem(CONTENT_KEY);
      if (storedContent) {
        resolve(JSON.parse(storedContent));
      } else {
        localStorage.setItem(CONTENT_KEY, JSON.stringify(defaultContent));
        resolve(defaultContent);
      }
    } else {
        resolve(defaultContent);
    }
  });
}

export async function saveContent(content: SiteContent): Promise<void> {
   return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
    }
    resolve();
  });
}
