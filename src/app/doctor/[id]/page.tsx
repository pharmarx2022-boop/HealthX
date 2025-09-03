
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, MapPin, Calendar, Clock, Star } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

const doctors = [
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

export default function DoctorDetailPage({ params }: { params: { id: string } }) {
  const doctor = doctors.find(d => d.id === params.id);

  if (!doctor) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
            <Card className="max-w-4xl mx-auto shadow-lg">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 p-6">
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                           <Image src={doctor.image} alt={`Dr. ${doctor.name}`} fill style={{objectFit:"cover"}} data-ai-hint={doctor.dataAiHint} />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="font-headline text-3xl">{doctor.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2 pt-1 text-base">
                                <Stethoscope className="w-5 h-5 text-primary" /> <span>{doctor.specialty}</span>
                            </CardDescription>
                            <div className="flex items-center gap-4 pt-2">
                                <div className="flex items-center gap-1 text-amber-500">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span className="font-bold">{doctor.rating}</span>
                                </div>
                                <span className="text-muted-foreground">({doctor.reviews} reviews)</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="flex items-center text-muted-foreground gap-2">
                                <MapPin className="w-5 h-5"/> 
                                <span>{doctor.location}</span>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">About Dr. {doctor.name.split(' ').pop()}</h3>
                                <p className="text-muted-foreground">{doctor.bio}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Available Today</h3>
                                <div className="flex gap-2">
                                    <Button variant="outline">10:00 AM</Button>
                                    <Button variant="outline">11:00 AM</Button>
                                    <Button>02:00 PM</Button>
                                    <Button variant="outline">04:00 PM</Button>
                                </div>
                            </div>
                            <Button size="lg" className="w-full mt-4">
                                <Calendar className="mr-2"/> Confirm Booking
                            </Button>
                        </CardContent>
                    </div>
                </div>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
