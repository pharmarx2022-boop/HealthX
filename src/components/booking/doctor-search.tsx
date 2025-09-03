'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, MapPin, Search, Calendar, Clock, User, Briefcase } from 'lucide-react';
import Image from 'next/image';


const doctors = [
  {
    id: '1',
    name: 'Dr. Anjali Sharma',
    specialty: 'Cardiologist',
    location: 'Mumbai, IN',
    distance: '2.5 km away',
    image: 'https://picsum.photos/200/200',
    dataAiHint: 'doctor portrait',
  },
  {
    id: '2',
    name: 'Dr. Vikram Singh',
    specialty: 'Dermatologist',
    location: 'Mumbai, IN',
    distance: '3.1 km away',
    image: 'https://picsum.photos/200/200',
    dataAiHint: 'doctor portrait',
  },
  {
    id: '3',
    name: 'Dr. Priya Patel',
    specialty: 'Pediatrician',
    location: 'Mumbai, IN',
    distance: '4.0 km away',
    image: 'https://picsum.photos/200/200',
    dataAiHint: 'doctor portrait',
  },
  {
    id: '4',
    name: 'Dr. Rohan Joshi',
    specialty: 'Orthopedic Surgeon',
    location: 'Mumbai, IN',
    distance: '5.2 km away',
    image: 'https://picsum.photos/200/200',
    dataAiHint: 'doctor portrait',
  },
];


export function DoctorSearch() {
  const [location, setLocation] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      setSearched(true);
    }
  };

  return (
    <div>
      <Card className="max-w-3xl mx-auto mb-10 shadow-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                type="text"
                placeholder="Enter your location (e.g., 'Mumbai')"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 h-12 text-base"
                />
            </div>
            <Button type="submit" size="lg" className="h-12 text-base">
              <Search className="mr-2" /> Find Doctors
            </Button>
          </form>
        </CardContent>
      </Card>

      {searched && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in-50">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative w-full h-48">
                  <Image src={doctor.image} alt={`Dr. ${doctor.name}`} fill objectFit="cover" data-ai-hint={doctor.dataAiHint} />
              </div>
              <CardHeader>
                <CardTitle className="font-headline text-xl">{doctor.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1">
                  <Stethoscope className="w-4 h-4 text-primary" /> <span>{doctor.specialty}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <MapPin className="w-4 h-4"/> 
                    <span>{doctor.location} ({doctor.distance})</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Clock className="w-4 h-4"/>
                    <span>Available Today</span>
                </div>
                <Button className="w-full mt-2">
                    <Calendar className="mr-2"/> Book Appointment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
