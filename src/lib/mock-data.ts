
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
    id: '1',
    name: 'Dr. Anjali Sharma',
    specialty: 'Cardiologist',
    location: 'Mumbai, IN',
    bio: 'Dr. Anjali Sharma is a renowned cardiologist with over 15 years of experience in treating complex heart conditions. She is known for her patient-centric approach and compassionate care.',
    rating: 4.9,
    reviews: 124,
    image: 'https://picsum.photos/id/1018/400/400',
    dataAiHint: 'doctor portrait',
    reviewsList: [
        { patientName: 'Rohan Sharma', rating: 5, comment: 'Dr. Sharma was fantastic. Very thorough and took the time to explain everything clearly.' },
        { patientName: 'Sunita Patil', rating: 4, comment: 'Good experience, the wait time was a bit long but the consultation was worth it.' },
    ]
  },
  {
    id: '2',
    name: 'Dr. Vikram Singh',
    specialty: 'Dermatologist',
    location: 'Mumbai, IN',
    bio: 'Dr. Vikram Singh is a leading dermatologist specializing in cosmetic and clinical dermatology. He is dedicated to providing personalized skin care solutions.',
    rating: 4.8,
    reviews: 98,
    image: 'https://picsum.photos/id/1027/400/400',
    dataAiHint: 'doctor portrait',
    reviewsList: [
        { patientName: 'Priya Mehta', rating: 5, comment: 'Excellent doctor! Solved my skin issue that had been bothering me for months.' },
    ]
  },
  {
    id: '3',
    name: 'Dr. Priya Patel',
    specialty: 'Pediatrician',
    location: 'Mumbai, IN',
    bio: 'Dr. Priya Patel is a compassionate pediatrician committed to providing the highest quality of care for children from infancy through adolescence.',
    rating: 4.9,
    reviews: 150,
    image: 'https://picsum.photos/id/1025/400/400',
    dataAiHint: 'doctor portrait',
    reviewsList: [
        { patientName: 'Amit Singh', rating: 5, comment: 'Dr. Patel is wonderful with kids. My son felt very comfortable with her.' },
    ]
  },
];


export const initialClinics = [
    {
        id: 'clinic1',
        doctorId: '1',
        name: 'Andheri West Clinic',
        location: '123 Health St, Andheri West, Mumbai',
        image: 'https://picsum.photos/id/180/400/300',
        dataAiHint: 'clinic exterior',
        days: ['Monday', 'Wednesday', 'Friday'],
        slots: '10:00 AM, 11:00 AM, 12:00 PM',
        consultationFee: 1500,
    },
    {
        id: 'clinic2',
        doctorId: '1',
        name: 'Dadar East Clinic',
        location: '456 Wellness Ave, Dadar East, Mumbai',
        image: 'https://picsum.photos/id/1015/400/300',
        dataAiHint: 'clinic interior',
        days: ['Tuesday', 'Thursday'],
        slots: '03:00 PM, 04:00 PM, 05:00 PM',
        consultationFee: 1200,
    }
];

export const initialPharmacies = [
    {
        id: 'pharm1',
        name: 'Wellness Forever Pharmacy',
        location: 'Shop 5, Andheri West',
        image: 'https://picsum.photos/id/24/400/300',
        acceptsHealthPoints: true,
        discount: 15,
        whatsappNumber: '919876543210'
    },
    {
        id: 'pharm2',
        name: 'Apollo Pharmacy',
        location: 'Main Road, Dadar',
        image: 'https://picsum.photos/id/219/400/300',
        acceptsHealthPoints: true,
        discount: 20,
        whatsappNumber: '919876543211'
    },
    {
        id: 'pharm3',
        name: 'Noble Medical',
        location: 'Linking Road, Bandra',
        image: 'https://picsum.photos/id/183/400/300',
        acceptsHealthPoints: false,
        discount: 0,
        whatsappNumber: '919876543212'
    }
];

export const initialLabs = [
    {
        id: 'lab1',
        name: 'Metropolis Lab',
        location: 'Near Andheri Station',
        image: 'https://picsum.photos/id/30/400/300',
        acceptsHealthPoints: true,
        discount: 30,
        whatsappNumber: '919876543213'
    },
    {
        id: 'lab2',
        name: 'Dr. Lal PathLabs',
        location: 'Near Dadar Circle',
        image: 'https://picsum.photos/id/31/400/300',
        acceptsHealthPoints: true,
        discount: 35,
        whatsappNumber: '919876543214'
    }
];


export const mockPatientData = [
    { id: 'rohan_sharma', name: 'Rohan Sharma', phone: '9876543210' },
    { id: 'priya_mehta', name: 'Priya Mehta', phone: '9876543211' },
];


export const mockReports: MockReport[] = [];

    