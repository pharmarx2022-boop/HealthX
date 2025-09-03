
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Stethoscope, MapPin, Pill, Loader2, AlertTriangle, Building, Link as LinkIcon, Search, PercentCircle, Beaker } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { initialDoctors, initialClinics, initialPharmacies, initialLabs } from '@/lib/mock-data';
import { Badge } from '../ui/badge';

// Types
type Doctor = typeof initialDoctors[0];
type Clinic = typeof initialClinics[0];
type Pharmacy = typeof initialPharmacies[0];
type Lab = typeof initialLabs[0];

const WhatsAppIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        className="text-green-500"
    >
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.38 1.25 4.81L2 22l5.29-1.38c1.37.71 2.93 1.11 4.59 1.11 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2z"></path>
        <path d="M16.92 14.37c-.14-.07-.84-.42-.97-.47-.13-.05-.23-.07-.33.07-.1.14-.37.47-.45.57-.08.1-.17.11-.3.05-.14-.07-1.46-.54-2.78-1.72-1.03-.92-1.73-2.05-2.02-2.39-.3-.34-.03-.52.04-.57.07-.05.14-.14.22-.22.08-.08.1-.14.17-.24.07-.1.03-.17-.02-.24-.05-.07-.33-.8-.45-1.1-.12-.3-.24-.26-.33-.26h-.3c-.1 0-.24.03-.37.14-.13.11-.5.48-.5.58 0 .1.03.14.07.17l.03.03c.53.47 1.02 1.14 1.48 1.83.47.7 1.13 1.52 2.39 2.11.3.14.56.22.84.28.3.06.84.05 1.12-.08.3-.14.84-.95.95-1.12.11-.17.11-.3.08-.37z" fill="white"></path>
    </svg>
)

export function NearbySearch() {
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);

  useEffect(() => {
    setIsClient(true);
    const storedClinics = sessionStorage.getItem('mockClinics');
    setClinics(storedClinics ? JSON.parse(storedClinics) : initialClinics);

    const storedPharmacies = sessionStorage.getItem('mockPharmacies');
    setPharmacies(storedPharmacies ? JSON.parse(storedPharmacies) : initialPharmacies);
    
    const storedLabs = sessionStorage.getItem('mockLabs');
    setLabs(storedLabs ? JSON.parse(storedLabs) : initialLabs);

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
            (err) => {
                setError(`Location access denied. Please enable it in your browser settings to find nearby services.`);
                setStatus('error');
            }
        );
    } else {
        setError('Geolocation is not supported by your browser.');
        setStatus('error');
    }
  }, []);

  const searchResults = useMemo(() => {
    const allPharmacies = pharmacies.filter(p => p.acceptsHealthPoints && p.discount >= 15);
    const allLabs = labs.filter(l => l.acceptsHealthPoints && l.discount >= 30);

    if (!searchTerm) {
        return { doctors: initialDoctors, pharmacies: allPharmacies, labs: allLabs };
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const filteredDoctors = initialDoctors.filter(d => 
        d.name.toLowerCase().includes(lowerCaseSearchTerm) || 
        d.specialty.toLowerCase().includes(lowerCaseSearchTerm)
    );

    const filteredPharmacies = allPharmacies.filter(p =>
        p.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
    
    const filteredLabs = allLabs.filter(l =>
        l.name.toLowerCase().includes(lowerCaseSearchTerm)
    );

    return { doctors: filteredDoctors, pharmacies: filteredPharmacies, labs: filteredLabs };

  }, [searchTerm, clinics, pharmacies, labs]);
  
  const renderContent = () => {
    switch(status) {
        case 'loading':
            return (
                <div className="text-center text-muted-foreground py-12">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4"/>
                    <p>Finding services near you...</p>
                </div>
            )
        case 'error':
            return (
                <div className="text-center text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg p-8">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-destructive"/>
                    <p className="font-semibold">{error}</p>
                </div>
            )
        case 'success':
            const { doctors, pharmacies, labs } = searchResults;
            return (
                <div className="space-y-8">
                    {doctors.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2"><Stethoscope/> Doctors</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {doctors.map((doctor) => {
                                    return (
                                        <Card key={doctor.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                                            <CardHeader className="flex-row gap-4 items-start">
                                                <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 border-2 border-primary/20">
                                                    <Image src={doctor.image} alt={`Dr. ${doctor.name}`} fill style={{objectFit:"cover"}} data-ai-hint={doctor.dataAiHint} />
                                                </div>
                                                <div className="flex-grow">
                                                    <CardTitle className="font-headline text-xl">{doctor.name}</CardTitle>
                                                    <CardDescription className="flex items-center gap-2 pt-1">
                                                        <Stethoscope className="w-4 h-4 text-primary" /> <span>{doctor.specialty}</span>
                                                    </CardDescription>
                                                    <div className="flex items-center text-sm text-muted-foreground gap-2 mt-2">
                                                        <MapPin className="w-4 h-4"/> 
                                                        <span>{doctor.location}</span>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="flex-grow space-y-4">
                                            </CardContent>
                                            <CardFooter>
                                                <Button asChild className="w-full mt-2">
                                                    <Link href={`/doctor/${doctor.id}`}>
                                                        View Profile & Book
                                                    </Link>
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                    {pharmacies.length > 0 && (
                         <section>
                            <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2"><Pill/> Pharmacies</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pharmacies.map((pharmacy) => (
                                    <Card key={pharmacy.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                                        <CardHeader>
                                            <div className="relative w-full h-40 rounded-lg overflow-hidden">
                                                 <Image src={pharmacy.image} alt={pharmacy.name} fill style={{objectFit:"cover"}} data-ai-hint="pharmacy exterior" />
                                            </div>
                                             <CardTitle className="font-headline text-xl pt-4">{pharmacy.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <div className="flex items-center text-muted-foreground gap-2">
                                                <MapPin className="w-4 h-4"/> 
                                                <span>{pharmacy.location}</span>
                                            </div>
                                            {pharmacy.acceptsHealthPoints && (
                                                <Badge className="mt-4" variant="secondary">
                                                    <PercentCircle className="mr-2 text-primary" /> Accepts Health Points ({pharmacy.discount}%)
                                                </Badge>
                                            )}
                                        </CardContent>
                                         <CardFooter>
                                             <Button asChild variant="outline" className="w-full">
                                                <a href={`https://wa.me/${pharmacy.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                                                    <WhatsAppIcon />
                                                    <span className="ml-2">Contact on WhatsApp</span>
                                                </a>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    )}
                    
                     {labs.length > 0 && (
                         <section>
                            <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2"><Beaker/> Labs</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {labs.map((lab) => (
                                    <Card key={lab.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                                        <CardHeader>
                                            <div className="relative w-full h-40 rounded-lg overflow-hidden">
                                                 <Image src={lab.image} alt={lab.name} fill style={{objectFit:"cover"}} data-ai-hint="lab exterior" />
                                            </div>
                                             <CardTitle className="font-headline text-xl pt-4">{lab.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <div className="flex items-center text-muted-foreground gap-2">
                                                <MapPin className="w-4 h-4"/> 
                                                <span>{lab.location}</span>
                                            </div>
                                            {lab.acceptsHealthPoints && (
                                                <Badge className="mt-4" variant="secondary">
                                                    <PercentCircle className="mr-2 text-primary" /> Accepts Health Points ({lab.discount}%)
                                                </Badge>
                                            )}
                                        </CardContent>
                                        <CardFooter>
                                             <Button asChild variant="outline" className="w-full">
                                                <a href={`https://wa.me/${lab.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                                                    <WhatsAppIcon />
                                                    <span className="ml-2">Contact on WhatsApp</span>
                                                </a>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    )}

                     {(doctors.length === 0 && pharmacies.length === 0 && labs.length === 0) && (
                        <div className="text-center py-16 text-muted-foreground">
                            <p>No results found for "{searchTerm}".</p>
                        </div>
                     )}
                </div>
            )
        default:
            return null;
    }
  }

  return (
    <div className="space-y-8">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
                placeholder="Search by doctor, specialty, pharmacy, lab..."
                className="pl-10 text-base py-6"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        {renderContent()}
    </div>
  );
}
