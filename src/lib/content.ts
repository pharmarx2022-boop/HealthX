
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
HealthX is a technology platform that connects Users seeking healthcare services with independent third-party healthcare providers. We do not provide healthcare services ourselves.

## 3. User Accounts & Registration
To access most features of the Platform, you must register for an account. You are responsible for safeguarding the password and for any activities or actions under your password.

## 4. Appointment Booking, Fees & Refund Policy
- **Pre-payment as Security Deposit:** To book a doctor's appointment, Patients must pre-pay the full consultation fee.
- **Refund and Reward Mechanism:** After the Patient attends the appointment and the Doctor marks it as "complete", a 100% cash refund is initiated and a 100% bonus in Health Points is credited.
- **No-Show Policy:** The pre-paid fee will NOT be refunded if the Patient fails to attend the scheduled appointment.

## 5. Health Point Policy
- **Earning:** Patients earn Health Points as a promotional bonus.
- **Value:** 1 Health Point is equivalent to INR 1.
- **Redemption:** Health Points can be used to pay for a percentage of services at participating partner Labs and Pharmacies.`,
  privacy: `## 1. Information We Collect
We may collect information about you in a variety of ways. The information we may collect on the Platform includes Personal Data and Sensitive Personal Data or Information (SPDI).

## 2. Use of Your Information
Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. We may use your information to create and manage your account, facilitate bookings, and process payments.

## 3. Disclosure of Your Information
We may share information we have collected about you in certain situations, such as By Law or to Protect Rights, with Third-Party Service Providers, and for Business Transfers.

## 4. Security of Your Information
We use administrative, technical, and physical security measures to help protect your personal information.

## 5. Grievance Officer
In accordance with the Information Technology Act 2000 and rules made thereunder, the name and contact details of the Grievance Officer are provided below: [Name], [Email].`,
};


export async function getContent(): Promise<SiteContent> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      const storedContent = sessionStorage.getItem(CONTENT_KEY);
      if (storedContent) {
        resolve(JSON.parse(storedContent));
      } else {
        sessionStorage.setItem(CONTENT_KEY, JSON.stringify(defaultContent));
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
        sessionStorage.setItem(CONTENT_KEY, JSON.stringify(content));
    }
    resolve();
  });
}
