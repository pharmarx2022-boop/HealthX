

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
    email: 'anjali@example.com',
    role: 'doctor',
    status: 'approved',
    dateJoined: '2023-01-15T10:00:00Z',
    specialty: 'Cardiologist',
    location: 'Mumbai, IN',
    bio: 'Dr. Anjali Sharma is a renowned cardiologist with over 15 years of experience in treating complex heart conditions. She is known for her patient-centric approach and compassionate care.',
    experience: 15,
    reviews: 124,
    image: 'https://picsum.photos/id/1018/400/400',
    dataAiHint: 'doctor portrait',
    googleMapsLink: 'https://maps.app.goo.gl/d3sUjZAd5a5A5A5A5',
    reviewsList: [
        { patientName: 'Rohan Sharma', rating: 5, comment: 'Dr. Sharma was fantastic. Very thorough and took the time to explain everything clearly.' },
        { patientName: 'Sunita Patil', rating: 4, comment: 'Good experience, the wait time was a bit long but the consultation was worth it.' },
    ],
    registrationNumber: 'MCI-12345',
    registrationCertificate: 'https://picsum.photos/id/10/800/600',
  },
  {
    id: '2',
    name: 'Dr. Vikram Singh',
    email: 'vikram@example.com',
    role: 'doctor',
    status: 'approved',
    dateJoined: '2023-02-20T11:00:00Z',
    specialty: 'Dermatologist',
    location: 'Mumbai, IN',
    bio: 'Dr. Vikram Singh is a leading dermatologist specializing in cosmetic and clinical dermatology. He is dedicated to providing personalized skin care solutions.',
    experience: 10,
    reviews: 98,
    image: 'https://picsum.photos/id/1027/400/400',
    dataAiHint: 'doctor portrait',
    googleMapsLink: 'https://maps.app.goo.gl/d3sUjZAd5a5A5A5A5',
    reviewsList: [
        { patientName: 'Priya Mehta', rating: 5, comment: 'Excellent doctor! Solved my skin issue that had been bothering me for months.' },
    ],
    registrationNumber: 'MCI-67890',
    registrationCertificate: 'https://picsum.photos/id/11/800/600',
  },
  {
    id: '3',
    name: 'Dr. Priya Patel',
    email: 'priya@example.com',
    role: 'doctor',
    status: 'approved',
    dateJoined: '2023-03-10T09:00:00Z',
    specialty: 'Pediatrician',
    location: 'Mumbai-IN',
    bio: 'Dr. Priya Patel is a compassionate pediatrician committed to providing the highest quality of care for children from infancy through adolescence.',
    experience: 12,
    reviews: 150,
    image: 'https://picsum.photos/id/1025/400/400',
    dataAiHint: 'doctor portrait',
    googleMapsLink: 'https://maps.app.goo.gl/d3sUjZAd5a5A5A5A5',
    reviewsList: [
        { patientName: 'Amit Singh', rating: 5, comment: 'Dr. Patel is wonderful with kids. My son felt very comfortable with her.' },
    ],
    registrationNumber: 'MCI-54321',
    registrationCertificate: 'https://picsum.photos/id/12/800/600',
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
        patientLimit: 20
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
        patientLimit: 15
    },
    {
        id: 'clinic3',
        doctorId: '2',
        name: 'Skin & Hair Clinic',
        location: '789 Beauty Plaza, Bandra West, Mumbai',
        image: 'https://picsum.photos/id/102/400/300',
        dataAiHint: 'clinic interior',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        slots: '09:00 AM, 10:30 AM, 12:00 PM, 02:00 PM',
        consultationFee: 2000,
        patientLimit: 25
    },
    {
        id: 'clinic4',
        doctorId: '3',
        name: 'Happy Kids Pediatrics',
        location: '101 Joy Building, Juhu, Mumbai',
        image: 'https://picsum.photos/id/103/400/300',
        dataAiHint: 'clinic interior children',
        days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        slots: '11:00 AM, 12:00 PM, 01:00 PM',
        consultationFee: 1000,
        patientLimit: 30
    }
];

export const initialPharmacies = [
    {
        id: 'pharm1',
        name: 'Wellness Forever Pharmacy',
        email: 'wellness@example.com',
        role: 'pharmacy',
        status: 'approved',
        dateJoined: '2023-01-20T14:00:00Z',
        location: 'Shop 5, Andheri West',
        image: 'https://picsum.photos/id/24/400/300',
        acceptsHealthPoints: true,
        discount: 15,
        whatsappNumber: '919876543210',
        googleMapsLink: 'https://maps.app.goo.gl/d3sUjZAd5a5A5A5A5',
        reviewsList: [
            { patientName: 'Rohan Sharma', rating: 5, comment: 'Great service and quick delivery.' },
            { patientName: 'Priya Mehta', rating: 4, comment: 'Well-stocked pharmacy.' },
        ],
        registrationNumber: 'PHM-MH-112233',
        registrationCertificate: 'https://picsum.photos/id/20/800/600',
    },
    {
        id: 'pharm2',
        name: 'Apollo Pharmacy',
        email: 'apollo@example.com',
        role: 'pharmacy',
        status: 'approved',
        dateJoined: '2023-02-15T16:00:00Z',
        location: 'Main Road, Dadar',
        image: 'https://picsum.photos/id/219/400/300',
        acceptsHealthPoints: true,
        discount: 20,
        whatsappNumber: '919876543211',
        googleMapsLink: 'https://maps.app.goo.gl/d3sUjZAd5a5A5A5A5',
        reviewsList: [
            { patientName: 'Amit Singh', rating: 5, comment: 'Very helpful staff.' },
        ],
        registrationNumber: 'PHM-MH-445566',
        registrationCertificate: 'https://picsum.photos/id/21/800/600',
    },
    {
        id: 'pharm3',
        name: 'Noble Medical',
        email: 'noble@example.com',
        role: 'pharmacy',
        status: 'approved',
        dateJoined: '2023-04-01T12:00:00Z',
        location: 'Linking Road, Bandra',
        image: 'https://picsum.photos/id/183/400/300',
        acceptsHealthPoints: false,
        discount: 0,
        whatsappNumber: '919876543212',
        googleMapsLink: 'https://maps.app.goo.gl/d3sUjZAd5a5A5A5A5',
        reviewsList: [],
        registrationNumber: 'PHM-MH-778899',
        registrationCertificate: 'https://picsum.photos/id/22/800/600',
    }
];

export const initialLabs = [
    {
        id: 'lab1',
        name: 'Metropolis Lab',
        email: 'metropolis@example.com',
        role: 'lab',
        status: 'approved',
        dateJoined: '2023-01-25T18:00:00Z',
        location: 'Near Andheri Station',
        image: 'https://picsum.photos/id/30/400/300',
        acceptsHealthPoints: true,
        discount: 30,
        whatsappNumber: '919876543213',
        googleMapsLink: 'https://maps.app.goo.gl/d3sUjZAd5a5A5A5A5',
        reviewsList: [
            { patientName: 'Sunita Patil', rating: 5, comment: 'Quick and efficient sample collection.' },
            { patientName: 'Karan Verma', rating: 4, comment: 'Reports were delivered on time.' },
        ],
        registrationNumber: 'LAB-MH-AABBCC',
        registrationCertificate: 'https://picsum.photos/id/33/800/600',
    },
    {
        id: 'lab2',
        name: 'Dr. Lal PathLabs',
        email: 'lalpath@example.com',
        role: 'lab',
        status: 'approved',
        dateJoined: '2023-03-05T13:00:00Z',
        location: 'Near Dadar Circle',
        image: 'https://picsum.photos/id/31/400/300',
        acceptsHealthPoints: true,
        discount: 35,
        whatsappNumber: '919876543214',
        googleMapsLink: 'https://maps.app.goo.gl/d3sUjZAd5a5A5A5A5',
        reviewsList: [],
        registrationNumber: 'LAB-MH-DDEEFF',
        registrationCertificate: 'https://picsum.photos/id/34/800/600',
    }
];


export const mockPatientData = [
    { id: 'rohan_sharma', name: 'Rohan Sharma', phone: '9876543210', email: 'rohan.sharma@example.com' },
    { id: 'priya_mehta', name: 'Priya Mehta', phone: '9876543211', email: 'priya.mehta@example.com' },
];


export const mockReports: MockReport[] = [];
