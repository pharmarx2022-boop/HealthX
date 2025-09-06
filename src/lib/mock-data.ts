

export type MockReport = {
    id: string;
    patientId: string;
    name: string;
    lab: string;
    date: string;
    file: string; // URL or path to the file
};

export const initialDoctors = [
  {
    id: 'doctor_1',
    name: 'Dr. Anjali Sharma',
    specialty: 'Cardiologist',
    experience: 15,
    location: 'Mumbai, IN',
    image: 'https://picsum.photos/seed/doc1/400/400',
    dataAiHint: "woman doctor",
    bio: 'Dr. Anjali Sharma is a renowned cardiologist with over 15 years of experience in treating complex heart conditions. She is known for her patient-centric approach and dedication to cardiac care.',
    googleMapsLink: 'https://maps.app.goo.gl/YourLinkHere',
    reviewsList: [
        { patientName: 'Rohan Verma', rating: 5, comment: 'Excellent doctor, very reassuring.' },
        { patientName: 'Priya Singh', rating: 4, comment: 'Good consultation, but the wait was long.' }
    ]
  },
  {
    id: 'doctor_2',
    name: 'Dr. Vikram Singh',
    specialty: 'Dermatologist',
    experience: 10,
    location: 'Delhi, IN',
    image: 'https://picsum.photos/seed/doc2/400/400',
    dataAiHint: "man doctor",
    bio: 'Dr. Vikram Singh specializes in cosmetic dermatology and has a decade of experience. He is an expert in the latest skin treatments and technologies.',
    googleMapsLink: 'https://maps.app.goo.gl/YourLinkHere',
    reviewsList: [
      { patientName: 'Amit Patel', rating: 5, comment: 'Very effective treatment for my acne.' },
    ]
  },
   {
    id: 'doctor_3',
    name: 'Dr. Priya Desai',
    specialty: 'Pediatrician',
    experience: 12,
    location: 'Bangalore, IN',
    image: 'https://picsum.photos/seed/doc3/400/400',
    dataAiHint: "indian doctor",
    bio: 'Dr. Priya Desai is a compassionate pediatrician dedicated to children\'s health. She has 12 years of experience and is great with kids.',
    googleMapsLink: 'https://maps.app.goo.gl/YourLinkHere',
    reviewsList: []
  },
];

export const initialClinics = [
  {
    id: 'clinic1',
    doctorId: 'doctor_1',
    name: 'Andheri West Clinic',
    location: '123 Health St, Andheri West, Mumbai',
    image: 'https://picsum.photos/seed/clinic1/800/600',
    dataAiHint: 'clinic interior',
    consultationFee: 1500,
    patientLimit: 25,
    availabilityType: 'days',
    days: ['Monday', 'Wednesday', 'Friday'],
    slots: '10:00 AM, 11:00 AM, 12:00 PM, 02:00 PM',
  },
  {
    id: 'clinic2',
    doctorId: 'doctor_1',
    name: 'Dadar East Clinic',
    location: '456 Wellness Ave, Dadar East, Mumbai',
    image: 'https://picsum.photos/seed/clinic2/800/600',
    dataAiHint: 'clinic inside',
    consultationFee: 1200,
    patientLimit: 30,
    availabilityType: 'days',
    days: ['Tuesday', 'Thursday', 'Saturday'],
    slots: '09:00 AM, 10:00 AM, 11:00 AM',
  },
  {
    id: 'clinic3',
    doctorId: 'doctor_2',
    name: 'Skin & Hair Clinic',
    location: '789 Beauty Blvd, Saket, Delhi',
    image: 'https://picsum.photos/seed/clinic3/800/600',
    dataAiHint: 'modern clinic',
    consultationFee: 1000,
    patientLimit: 20,
    availabilityType: 'dates',
    specificDates: [new Date(2024, 6, 20).toISOString(), new Date(2024, 6, 27).toISOString()],
    slots: '03:00 PM, 04:00 PM, 05:00 PM',
  },
  {
    id: 'clinic4',
    doctorId: 'doctor_3',
    name: 'Happy Kids Pediatrics',
    location: '101 Joyful Rd, Koramangala, Bangalore',
    image: 'https://picsum.photos/seed/clinic4/800/600',
    dataAiHint: 'pediatric clinic',
    consultationFee: 800,
    patientLimit: 15,
    availabilityType: 'days',
    days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    slots: '10:00 AM, 11:30 AM, 01:00 PM',
  }
];


export const initialPharmacies = [
    {
        id: 'pharmacy_1',
        name: 'Wellness Forever',
        location: 'Shop 5, Andheri West, Mumbai',
        image: 'https://picsum.photos/seed/pharm1/800/600',
        dataAiHint: "pharmacy exterior",
        discount: 20,
        acceptsHealthPoints: true,
        homeDeliveryEnabled: true,
        deliveryRadius: 5,
        phoneNumber: '919876543210',
        googleMapsLink: 'https://maps.app.goo.gl/YourLinkHere',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        hours: '24 hours',
        reviewsList: [
            { patientName: 'Sunita Rai', rating: 5, comment: 'Fast delivery and good discounts.' },
        ]
    },
    {
        id: 'pharmacy_2',
        name: 'Apollo Pharmacy',
        location: 'Main Market, Saket, Delhi',
        image: 'https://picsum.photos/seed/pharm2/800/600',
        dataAiHint: "pharmacy inside",
        discount: 15,
        acceptsHealthPoints: true,
        homeDeliveryEnabled: false,
        phoneNumber: '919876543211',
        googleMapsLink: 'https://maps.app.goo.gl/YourLinkHere',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        hours: '9:00 AM - 10:00 PM',
        reviewsList: []
    }
];

export const initialLabs = [
    {
        id: 'lab_1',
        name: 'Metropolis Labs',
        location: 'Jubilee Hills, Hyderabad',
        image: 'https://picsum.photos/seed/lab1/800/600',
        dataAiHint: "lab inside",
        discount: 30,
        acceptsHealthPoints: true,
        homeCollectionEnabled: true,
        collectionRadius: 10,
        phoneNumber: '919876543212',
        googleMapsLink: 'https://maps.app.goo.gl/YourLinkHere',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        hours: '7:00 AM - 9:00 PM',
        reviewsList: [
             { patientName: 'Vijay Kumar', rating: 4, comment: 'Home collection was on time.' },
        ]
    },
];


export const mockPatientData = [
  { id: 'patient_1', name: 'Rohan Sharma', email: 'rohan@example.com', phone: '9876543210' },
  { id: 'patient_2', name: 'Priya Singh', email: 'priya@example.com', phone: '9876543211' },
];

export const mockReports: MockReport[] = [
    { id: 'rep1', patientId: 'patient_1', name: 'Complete Blood Count', lab: 'Metropolis Labs', date: '2024-05-10T10:00:00Z', file: 'mock.pdf' },
    { id: 'rep2', patientId: 'patient_1', name: 'Lipid Profile', lab: 'Metropolis Labs', date: '2024-05-10T10:00:00Z', file: 'mock.pdf' }
];
