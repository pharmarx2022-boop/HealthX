

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
        id: "doctor_anjali_1687890123",
        name: "Dr. Anjali Sharma",
        email: "anjali.sharma@example.com",
        phone: "9876543210",
        password: "password123",
        role: "doctor",
        specialty: "Cardiologist",
        experience: 15,
        location: "Mumbai, IN",
        bio: "Dr. Anjali Sharma is a renowned cardiologist with over 15 years of experience in treating complex heart conditions. She is known for her patient-centric approach and dedication to providing the best possible care.",
        image: "https://picsum.photos/seed/doc1/400/400",
        dataAiHint: "female doctor portrait",
        googleMapsLink: "https://maps.app.goo.gl/u8i5jJtF5wSgEa7aA",
        registrationNumber: "MDC-12345",
        registrationCertificate: "https://picsum.photos/seed/cert1/800/600",
        referralCode: "HX-DOCANJALI",
        status: "approved",
        reviewsList: [
            { patientName: "Rohan Patel", rating: 5, comment: "Excellent doctor, very caring and thorough." },
            { patientName: "Priya Singh", rating: 4, comment: "Good experience, but the wait time was a bit long." }
        ]
    },
    {
        id: "doctor_vikram_1687890456",
        name: "Dr. Vikram Singh",
        email: "vikram.singh@example.com",
        phone: "9876543211",
        password: "password123",
        role: "doctor",
        specialty: "Pediatrician",
        experience: 10,
        location: "Delhi, IN",
        bio: "Dr. Vikram Singh is a compassionate pediatrician dedicated to the health and well-being of children. He has a friendly demeanor that makes kids comfortable during their visits.",
        image: "https://picsum.photos/seed/doc2/400/400",
        dataAiHint: "male doctor portrait",
        googleMapsLink: "https://maps.app.goo.gl/u8i5jJtF5wSgEa7aA",
        registrationNumber: "DMC-67890",
        registrationCertificate: "https://picsum.photos/seed/cert2/800/600",
        referralCode: "HX-DOCVIKRAM",
        status: "approved",
        reviewsList: [
             { patientName: "Aarav Mehta", rating: 5, comment: "My son loves Dr. Vikram. He's the best!" }
        ]
    }
];

export const initialClinics: any[] = [
    {
        id: "clinic1",
        doctorId: "doctor_anjali_1687890123",
        name: "Andheri West Clinic",
        location: "Andheri West, Mumbai",
        image: "https://picsum.photos/seed/clinic1/400/300",
        googleMapsLink: "https://maps.app.goo.gl/u8i5jJtF5wSgEa7aA",
        dataAiHint: "clinic interior",
        consultationFee: 1500,
        patientLimit: 25,
        availabilityType: 'days',
        days: ["Monday", "Wednesday", "Friday"],
        slots: "10:00 AM, 11:00 AM, 12:00 PM, 02:00 PM, 03:00 PM",
    },
     {
        id: "clinic2",
        doctorId: "doctor_anjali_1687890123",
        name: "Dadar East Clinic",
        location: "Dadar East, Mumbai",
        image: "https://picsum.photos/seed/clinic2/400/300",
        googleMapsLink: "https://maps.app.goo.gl/u8i5jJtF5wSgEa7aA",
        dataAiHint: "clinic building",
        consultationFee: 1200,
        patientLimit: 20,
        availabilityType: 'days',
        days: ["Tuesday", "Thursday"],
        slots: "09:00 AM, 10:00 AM, 11:00 AM",
    },
    {
        id: "clinic3",
        doctorId: "doctor_vikram_1687890456",
        name: "Happy Kids Pediatrics",
        location: "Greater Kailash, Delhi",
        image: "https://picsum.photos/seed/clinic3/400/300",
        googleMapsLink: "https://maps.app.goo.gl/u8i5jJtF5wSgEa7aA",
        dataAiHint: "children clinic",
        consultationFee: 800,
        patientLimit: 30,
        availabilityType: 'days',
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        slots: "10:00 AM, 11:00 AM, 12:00 PM, 04:00 PM, 05:00 PM, 06:00 PM",
    }
];


export const initialPharmacies: any[] = [
    {
        id: "pharmacy_wellness_1687890789",
        name: "Wellness Forever Pharmacy",
        email: "contact@wellness.com",
        role: "pharmacy",
        location: "Juhu, Mumbai",
        image: "https://picsum.photos/seed/pharm1/400/300",
        dataAiHint: "pharmacy exterior",
        discount: 20,
        phoneNumber: "919988776655",
        googleMapsLink: "https://maps.app.goo.gl/u8i5jJtF5wSgEa7aA",
        registrationNumber: "PH-MUM-1122",
        registrationCertificate: "https://picsum.photos/seed/cert3/800/600",
        referralCode: "HX-PHRMWELL",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        hours: "8:00 AM - 11:00 PM",
        homeDeliveryEnabled: true,
        deliveryRadius: 5,
        acceptsHealthPoints: true,
        status: "approved",
        reviewsList: [
            { patientName: "Rohan Patel", rating: 5, comment: "Fast delivery and great service." }
        ]
    }
];

export const initialLabs: any[] = [
     {
        id: "lab_metropolis_1687891122",
        name: "Metropolis Lab",
        email: "support@metropolis.com",
        role: "lab",
        location: "Bandra, Mumbai",
        image: "https://picsum.photos/seed/lab1/400/300",
        dataAiHint: "science lab",
        discount: 30,
        phoneNumber: "919988776644",
        googleMapsLink: "https://maps.app.goo.gl/u8i5jJtF5wSgEa7aA",
        registrationNumber: "LAB-MUM-3344",
        registrationCertificate: "https://picsum.photos/seed/cert4/800/600",
        referralCode: "HX-LABMETRO",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        hours: "7:00 AM - 9:00 PM",
        homeCollectionEnabled: true,
        collectionRadius: 10,
        acceptsHealthPoints: true,
        status: "approved",
        reviewsList: [
             { patientName: "Priya Singh", rating: 4, comment: "Reports were on time. Good service." }
        ],
        healthPackages: [
            { id: 'pkg1', name: 'Basic Health Check', price: 999, description: 'A basic checkup for overall health.', tests: 'CBC, Blood Sugar, Lipid Profile' },
            { id: 'pkg2', name: 'Advanced Heart Check', price: 2499, description: 'Comprehensive heart checkup.', tests: 'ECG, Echo, Lipid Profile, Cardiac Markers' }
        ]
    }
];


export const mockPatientData: any[] = [
    {
        id: 'appt_rohan_1',
        patientId: 'patient_rohan_1687889900',
        name: 'Rohan Patel',
        email: 'rohan.patel@example.com',
        phone: '9820098200',
        role: 'patient',
        status: 'approved',
        transactionId: 'txn_1',
        clinic: 'Andheri West Clinic',
        clinicId: 'clinic1',
        doctorId: 'doctor_anjali_1687890123',
        bookedById: null,
        bookedByRole: null,
        appointmentDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
        consultation: 'Follow-up Consultation',
        consultationFee: 1500,
        refundStatus: 'Not Refunded',
        status: 'upcoming',
        reviewed: false,
        patientOptsOut: false
    },
    {
        id: 'appt_priya_1',
        patientId: 'patient_priya_1687889955',
        name: 'Priya Singh',
        email: 'priya.singh@example.com',
        phone: '9820098201',
        role: 'patient',
        status: 'approved',
        transactionId: 'txn_2',
        clinic: 'Happy Kids Pediatrics',
        clinicId: 'clinic3',
        doctorId: 'doctor_vikram_1687890456',
        bookedById: 'hc_amit_1687891455',
        bookedByRole: 'health-coordinator',
        appointmentDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
        consultation: 'Fever and Cold',
        consultationFee: 800,
        refundStatus: 'Refunded',
        status: 'done',
        reviewed: true,
        patientOptsOut: false
    },
    {
        id: 'appt_suresh_1',
        patientId: 'patient_test_1',
        name: 'Suresh Sharma',
        email: 'patient@example.com',
        phone: '9876543210',
        role: 'patient',
        status: 'approved',
        transactionId: 'txn_3',
        clinic: 'Dadar East Clinic',
        clinicId: 'clinic2',
        doctorId: 'doctor_anjali_1687890123',
        bookedById: null,
        bookedByRole: null,
        appointmentDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
        consultation: 'General Checkup',
        consultationFee: 1200,
        refundStatus: 'Refunded',
        status: 'done',
        reviewed: false,
        patientOptsOut: false
    }
];


export const mockReports: MockReport[] = [
    {
        id: 'rep1',
        patientId: 'patient_priya_1687889955',
        name: 'Complete Blood Count',
        lab: 'Metropolis Lab',
        date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
        file: 'mock.pdf'
    }
];
