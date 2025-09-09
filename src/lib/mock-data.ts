

// THIS FILE WOULD BE REMOVED IN A PRODUCTION ENVIRONMENT
// It contains mock data for prototyping purposes. In a live application,
// all data would be fetched from a secure backend API and database.

export type MockReport = {
    id: string;
    patientId: string;
    name: string;
    lab: string;
    date: string;
    file: string; // URL or path to the file
};

export const initialDoctors: any[] = [
  {
    id: 'doctor_1',
    name: 'Dr. Anjali Sharma',
    email: 'anjali.sharma@healthx.com',
    phone: '9876543210',
    specialty: 'Cardiologist',
    experience: 15,
    location: 'Mumbai, IN',
    bio: 'Dr. Anjali Sharma is a renowned cardiologist with over 15 years of experience in treating heart conditions. She is known for her patient-centric approach and dedication to providing the best possible care.',
    image: 'https://placehold.co/400x400/EBF5FF/1E40AF?text=AS',
    dataAiHint: 'professional woman doctor',
    password: 'password',
    status: 'approved',
    dateJoined: '2023-01-15T09:00:00.000Z',
    registrationNumber: 'MEDC12345',
    registrationCertificate: 'https://placehold.co/800x600/EBF5FF/1E40AF?text=Cert',
    reviewsList: [
      { patientName: 'Rohan Verma', rating: 5, comment: 'Very knowledgeable and reassuring.' },
      { patientName: 'Priya Mehta', rating: 4, comment: 'Good experience, but the wait time was a bit long.' },
    ],
    googleMapsLink: 'https://maps.app.goo.gl/YourMapLink1',
    referralCode: 'AnjaliRef54321'
  },
  {
    id: 'doctor_2',
    name: 'Dr. Vikram Singh',
    email: 'vikram.singh@healthx.com',
    phone: '9876543211',
    specialty: 'Dermatologist',
    experience: 8,
    location: 'Delhi, IN',
    bio: 'Dr. Vikram Singh specializes in dermatological treatments and cosmetic procedures. He stays updated with the latest advancements in skin care to offer effective solutions.',
    image: 'https://placehold.co/400x400/EBF5FF/1E40AF?text=VS',
    dataAiHint: 'professional man doctor',
    password: 'password',
    status: 'approved',
    dateJoined: '2023-02-20T11:00:00.000Z',
    registrationNumber: 'MEDC67890',
    registrationCertificate: 'https://placehold.co/800x600/EBF5FF/1E40AF?text=Cert',
    reviewsList: [
      { patientName: 'Amit Kumar', rating: 5, comment: 'Excellent doctor, helped with my acne problem.' },
    ],
    googleMapsLink: 'https://maps.app.goo.gl/YourMapLink2',
    referralCode: 'VikramRef12345'
  },
];

export const initialClinics: any[] = [
    {
        id: 'clinic_1',
        doctorId: 'doctor_1',
        name: 'HeartCare Clinic (Andheri)',
        location: '123 Health St, Andheri West, Mumbai',
        image: 'https://placehold.co/600x400/EBF5FF/1E40AF?text=Clinic+1',
        googleMapsLink: 'https://maps.app.goo.gl/YourClinicMap1',
        dataAiHint: 'clinic interior',
        consultationFee: 1500,
        patientLimit: 25,
        availabilityType: 'days',
        days: ['Monday', 'Wednesday', 'Friday'],
        specificDates: [],
        slots: '10:00 AM, 11:00 AM, 12:00 PM, 02:00 PM, 03:00 PM',
    },
    {
        id: 'clinic_2',
        doctorId: 'doctor_1',
        name: 'South Mumbai Cardiology',
        location: '456 Wellness Ave, Colaba, Mumbai',
        image: 'https://placehold.co/600x400/EBF5FF/1E40AF?text=Clinic+2',
        googleMapsLink: 'https://maps.app.goo.gl/YourClinicMap2',
        dataAiHint: 'clinic building',
        consultationFee: 2000,
        patientLimit: 20,
        availabilityType: 'days',
        days: ['Tuesday', 'Thursday'],
        specificDates: [],
        slots: '09:00 AM, 10:00 AM, 11:00 AM',
    },
     {
        id: 'clinic_3',
        doctorId: 'doctor_2',
        name: 'Skin & Glow Dermatology',
        location: '789 Beauty Rd, Hauz Khas, Delhi',
        image: 'https://placehold.co/600x400/EBF5FF/1E40AF?text=Clinic+3',
        googleMapsLink: 'https://maps.app.goo.gl/YourClinicMap3',
        dataAiHint: 'modern clinic',
        consultationFee: 800,
        patientLimit: 30,
        availabilityType: 'days',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        specificDates: [],
        slots: '10:00 AM, 10:30 AM, 11:00 AM, 11:30 AM, 02:00 PM, 02:30 PM, 03:00 PM',
    }
];

export const initialPharmacies: any[] = [
    {
        id: 'pharmacy_1',
        name: 'Wellness Forever Pharmacy',
        email: 'contact@wellnessforever.com',
        location: 'Juhu, Mumbai',
        image: 'https://placehold.co/600x400/FFF7ED/FB923C?text=Pharmacy',
        dataAiHint: 'pharmacy storefront',
        discount: 10,
        phoneNumber: '9123456789',
        referralCode: 'WFRef54321',
        googleMapsLink: 'https://maps.app.goo.gl/YourPharmaMap1',
        registrationNumber: 'PHARMA12345',
        registrationCertificate: 'https://placehold.co/800x600/FFF7ED/FB923C?text=Cert',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        hours: '24 Hours',
        homeDeliveryEnabled: true,
        deliveryRadius: 5,
        acceptsHealthPoints: true,
        password: 'password',
        status: 'approved',
        dateJoined: '2023-03-10T14:00:00.000Z',
        reviewsList: [
            { patientName: 'Rohan Verma', rating: 5, comment: 'Fast delivery and great service.' },
        ]
    }
];

export const initialLabs: any[] = [
    {
        id: 'lab_1',
        name: 'Metropolis Labs',
        email: 'support@metropolis.com',
        location: 'Dadar, Mumbai',
        image: 'https://placehold.co/600x400/F0F9FF/38BDF8?text=Lab',
        dataAiHint: 'lab storefront',
        discount: 20,
        phoneNumber: '9988776655',
        referralCode: 'MetroRef98765',
        googleMapsLink: 'https://maps.app.goo.gl/YourLabMap1',
        registrationNumber: 'LABC67890',
        registrationCertificate: 'https://placehold.co/800x600/F0F9FF/38BDF8?text=Cert',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        hours: '7:00 AM - 9:00 PM',
        homeCollectionEnabled: true,
        collectionRadius: 10,
        acceptsHealthPoints: true,
        password: 'password',
        status: 'approved',
        dateJoined: '2023-04-01T08:00:00.000Z',
        reviewsList: [
             { patientName: 'Priya Mehta', rating: 4, comment: 'Home collection was on time.' },
        ],
        healthPackages: [
            { id: 'pkg1', name: 'Basic Health Checkup', price: 999, description: 'A basic package covering essential tests for a routine health check.', tests: ['Complete Blood Count (CBC)', 'Fasting Blood Sugar', 'Lipid Profile', 'Urine Routine'] },
            { id: 'pkg2', name: 'Advanced Heart Check', price: 2499, description: 'A comprehensive package for evaluating heart health.', tests: ['Lipid Profile', 'ECG', 'HbA1c', 'C-Reactive Protein (CRP)'] }
        ]
    }
];

export const mockPatientData: any[] = [
  {
    id: 'appt_1',
    patientId: 'patient_1',
    name: 'Rohan Verma',
    clinic: 'HeartCare Clinic (Andheri)',
    clinicId: 'clinic_1',
    doctorId: 'doctor_1',
    healthCoordinatorId: 'hc_1',
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    status: 'upcoming',
    consultation: 'Follow-up for hypertension',
    notes: '',
    consultationFee: 1500,
    refundStatus: 'Not Refunded',
    nextAppointmentDate: null,
    reviewed: false,
    transactionId: 'txn_1',
  },
  {
    id: 'appt_2',
    patientId: 'patient_2',
    name: 'Priya Mehta',
    clinic: 'HeartCare Clinic (Andheri)',
    clinicId: 'clinic_1',
    doctorId: 'doctor_1',
    healthCoordinatorId: null,
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    status: 'done',
    consultation: 'Chest pain evaluation',
    notes: 'Prescribed medication and recommended a follow-up EKG.',
    consultationFee: 1500,
    refundStatus: 'Refunded (Completed)',
    nextAppointmentDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
    reviewed: true,
    transactionId: 'txn_2',
  },
   {
    id: 'appt_3',
    patientId: 'patient_3',
    name: 'Amit Kumar',
    clinic: 'Skin & Glow Dermatology',
    clinicId: 'clinic_3',
    doctorId: 'doctor_2',
    healthCoordinatorId: 'hc_1',
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    status: 'done',
    consultation: 'Acne treatment',
    notes: 'Advised on skincare routine and prescribed topical medication.',
    consultationFee: 800,
    refundStatus: 'Refunded (Completed)',
    nextAppointmentDate: null,
    reviewed: true,
    transactionId: 'txn_3',
  }
];

export const mockReports: MockReport[] = [
    {
        id: 'rep1',
        patientId: 'patient_1',
        name: 'Lipid Profile Report',
        lab: 'Metropolis Labs',
        date: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
        file: 'mock.pdf'
    },
    {
        id: 'rep2',
        patientId: 'patient_1',
        name: 'Complete Blood Count',
        lab: 'Metropolis Labs',
        date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
        file: 'mock.pdf'
    },
];
