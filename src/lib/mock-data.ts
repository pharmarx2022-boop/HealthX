
export const initialDoctors = [
  {
    id: '1',
    name: 'Dr. Anjali Sharma',
    specialty: 'Cardiologist',
    location: 'Mumbai, IN',
    bio: 'Dr. Anjali Sharma is a renowned cardiologist with over 15 years of experience in treating complex heart conditions. She is known for her patient-centric approach and compassionate care.',
    rating: 4.9,
    reviews: 124,
    image: 'https://picsum.photos/400/400',
    dataAiHint: 'doctor portrait',
  },
  {
    id: '2',
    name: 'Dr. Vikram Singh',
    specialty: 'Dermatologist',
    location: 'Mumbai, IN',
    bio: 'Dr. Vikram Singh is a leading dermatologist specializing in cosmetic and clinical dermatology. He is dedicated to providing personalized skin care solutions.',
    rating: 4.8,
    reviews: 98,
    image: 'https://picsum.photos/400/400',
    dataAiHint: 'doctor portrait',
  },
  {
    id: '3',
    name: 'Dr. Priya Patel',
    specialty: 'Pediatrician',
    location: 'Mumbai, IN',
    bio: 'Dr. Priya Patel is a compassionate pediatrician committed to providing the highest quality of care for children from infancy through adolescence.',
    rating: 4.9,
    reviews: 150,
    image: 'https://picsum.photos/400/400',
    dataAiHint: 'doctor portrait',
  },
];


export const mockPharmacies = [
    {
        id: 'pharm1',
        name: 'Wellness Forever',
        location: 'Mumbai, IN',
        distance: '1.2 km away',
        image: 'https://picsum.photos/200/200',
        dataAiHint: 'pharmacy storefront',
    },
    {
        id: 'pharm2',
        name: 'Apollo Pharmacy',
        location: 'Mumbai, IN',
        distance: '2.8 km away',
        image: 'https://picsum.photos/200/200',
        dataAiHint: 'pharmacy storefront',
    },
    {
        id: 'pharm3',
        name: 'Noble Plus Pharmacy',
        location: 'Mumbai, IN',
        distance: '3.5 km away',
        image: 'https://picsum.photos/200/200',
        dataAiHint: 'pharmacy storefront',
    }
]

export const mockLabs = [
    {
        id: 'lab1',
        name: 'Metropolis Labs',
        location: 'Mumbai, IN',
        distance: '3.5 km away',
        image: 'https://picsum.photos/200/200',
        dataAiHint: 'laboratory interior',
    },
    {
        id: 'lab2',
        name: 'Dr. Lal PathLabs',
        location: 'Mumbai, IN',
        distance: '4.1 km away',
        image: 'https://picsum.photos/200/200',
        dataAiHint: 'laboratory interior',
    },
     {
        id: 'lab3',
        name: 'SRL Diagnostics',
        location: 'Mumbai, IN',
        distance: '1.8 km away',
        image: 'https://picsum.photos/200/200',
        dataAiHint: 'laboratory interior',
    }
]


export const initialClinics = [
    {
        id: 'clinic1',
        doctorId: '1',
        name: 'Andheri West Clinic',
        location: '123 Health St, Andheri West, Mumbai',
        image: 'https://picsum.photos/400/300',
        dataAiHint: 'clinic exterior',
        days: ['Monday', 'Wednesday', 'Friday'],
        slots: '10:00 AM, 11:00 AM, 12:00 PM',
        associatedPharmacyIds: ['pharm1', 'pharm2'],
        associatedLabIds: ['lab2'],
    },
    {
        id: 'clinic2',
        doctorId: '1',
        name: 'Dadar East Clinic',
        location: '456 Wellness Ave, Dadar East, Mumbai',
        image: 'https://picsum.photos/400/300',
        dataAiHint: 'clinic interior',
        days: ['Tuesday', 'Thursday'],
        slots: '03:00 PM, 04:00 PM, 05:00 PM',
        associatedPharmacyIds: ['pharm3'],
        associatedLabIds: ['lab1', 'lab3'],
    }
];
