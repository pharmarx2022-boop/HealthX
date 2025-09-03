'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Stethoscope, MapPin, Calendar, Clock, Pill, FlaskConical, Loader2, AlertTriangle } from 'lucide-react';
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
];

const pharmacies = [
    {
        id: '1',
        name: 'Wellness Forever',
        location: 'Mumbai, IN',
        distance: '1.2 km away',
        image: 'https://picsum.photos/200/200',
        dataAiHint: 'pharmacy storefront',
    },
    {
        id: '2',
        name: 'Apollo Pharmacy',
        location: 'Mumbai, IN',
        distance: '2.8 km away',
        image: 'https://picsum.photos/200/200',
        dataAiHint: 'pharmacy storefront',
    }
]

const labs = [
    {
        id: '1',
        name: 'Metropolis Labs',
        location: 'Mumbai, IN',
        distance: '3.5 km away',
        image: 'https://picsum.photos/200/200',
        dataAiHint: 'laboratory interior',
    },
    {
        id: '2',
        name: 'Dr. Lal PathLabs',
        location: 'Mumbai, IN',
        distance: '4.1 km away',
        image: 'https://picsum.photos/200/200',
        dataAiHint: 'laboratory interior',
    }
]


export function NearbySearch() {
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        setStatus('loading');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
                setStatus('success');
            },
            (error) => {
                setError(`Error: ${error.message}`);
                setStatus('error');
            }
        );
    } else {
        setError('Geolocation is not supported by your browser.');
        setStatus('error');
    }
  }, []);

  const renderContent = () => {
    switch(status) {
        case 'loading':
            return (
                <div className="text-center text-muted-foreground py-12">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4"/>
                    <p>Fetching your location to find nearby services...</p>
                </div>
            )
        case 'error':
            return (
                <div className="text-center text-destructive py-12">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4"/>
                    <p>{error}</p>
                    <p className="mt-2 text-sm">Please enable location services in your browser settings and refresh the page.</p>
                </div>
            )
        case 'success':
            return (
                <Tabs defaultValue="doctors" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto mb-8">
                        <TabsTrigger value="doctors"><Stethoscope className="mr-2"/> Doctors</TabsTrigger>
                        <TabsTrigger value="pharmacies"><Pill className="mr-2"/> Pharmacies</TabsTrigger>
                        <TabsTrigger value="labs"><FlaskConical className="mr-2"/> Labs</TabsTrigger>
                    </TabsList>
                    <TabsContent value="doctors" className="animate-in fade-in-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {doctors.map((doctor) => (
                                <Card key={doctor.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <div className="relative w-full h-48">
                                    <Image src={doctor.image} alt={`Dr. ${doctor.name}`} fill style={{objectFit:"cover"}} data-ai-hint={doctor.dataAiHint} />
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
                    </TabsContent>
                    <TabsContent value="pharmacies" className="animate-in fade-in-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {pharmacies.map((pharmacy) => (
                                <Card key={pharmacy.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    <div className="relative w-full h-48">
                                        <Image src={pharmacy.image} alt={pharmacy.name} fill style={{objectFit:"cover"}} data-ai-hint={pharmacy.dataAiHint} />
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="font-headline text-xl">{pharmacy.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                                            <MapPin className="w-4 h-4"/> 
                                            <span>{pharmacy.location} ({pharmacy.distance})</span>
                                        </div>
                                        <Button className="w-full mt-2" variant="outline">View Details</Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="labs" className="animate-in fade-in-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {labs.map((lab) => (
                                <Card key={lab.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    <div className="relative w-full h-48">
                                        <Image src={lab.image} alt={lab.name} fill style={{objectFit:"cover"}} data-ai-hint={lab.dataAiHint} />
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="font-headline text-xl">{lab.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                                            <MapPin className="w-4 h-4"/> 
                                            <span>{lab.location} ({lab.distance})</span>
                                        </div>
                                        <Button className="w-full mt-2" variant="outline">View Services</Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            )
        default:
            return null;
    }
  }

  return (
    <div>
        {renderContent()}
    </div>
  );
}
