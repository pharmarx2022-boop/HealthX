
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Stethoscope, MapPin, Pill, FlaskConical, Loader2, AlertTriangle, Building, LinkIcon, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { initialDoctors, mockPharmacies, mockLabs, initialClinics } from '@/lib/mock-data';
import { Badge } from '../ui/badge';

// Types
type Doctor = typeof initialDoctors[0];
type Pharmacy = typeof mockPharmacies[0];
type Lab = typeof mockLabs[0];
type Clinic = typeof initialClinics[0];


export function NearbySearch() {
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [clinics, setClinics] = useState<Clinic[]>([]);

  useEffect(() => {
    setIsClient(true);
    const storedClinics = sessionStorage.getItem('mockClinics');
    setClinics(storedClinics ? JSON.parse(storedClinics) : initialClinics);

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
    if (!searchTerm) {
        return { doctors: initialDoctors, pharmacies: mockPharmacies, labs: mockLabs };
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const filteredDoctors = initialDoctors.filter(d => 
        d.name.toLowerCase().includes(lowerCaseSearchTerm) || 
        d.specialty.toLowerCase().includes(lowerCaseSearchTerm)
    );

    const filteredPharmacies = mockPharmacies.filter(p => 
        p.name.toLowerCase().includes(lowerCaseSearchTerm)
    );

    const filteredLabs = mockLabs.filter(l => 
        l.name.toLowerCase().includes(lowerCaseSearchTerm)
    );

    // Find doctors associated with filtered pharmacies/labs
    const doctorsFromPharmacies = clinics.filter(c => 
        (c.associatedPharmacyIds ?? []).some(id => filteredPharmacies.some(p => p.id === id))
    ).map(c => c.doctorId);

    const doctorsFromLabs = clinics.filter(c =>
        (c.associatedLabIds ?? []).some(id => filteredLabs.some(l => l.id === id))
    ).map(c => c.doctorId);

    const associatedDoctorIds = new Set([...doctorsFromPharmacies, ...doctorsFromLabs]);
    
    initialDoctors.forEach(doc => {
        if (associatedDoctorIds.has(doc.id)) {
            if (!filteredDoctors.some(d => d.id === doc.id)) {
                filteredDoctors.push(doc);
            }
        }
    });
    
    // Find pharmacies/labs associated with filtered doctors
    const associatedPharmacyIds = new Set<string>();
    const associatedLabIds = new Set<string>();

    clinics.forEach(clinic => {
        if (filteredDoctors.some(doc => doc.id === clinic.doctorId)) {
            clinic.associatedPharmacyIds?.forEach(id => associatedPharmacyIds.add(id));
            clinic.associatedLabIds?.forEach(id => associatedLabIds.add(id));
        }
    });

    mockPharmacies.forEach(pharm => {
        if (associatedPharmacyIds.has(pharm.id)) {
            if (!filteredPharmacies.some(p => p.id === pharm.id)) {
                filteredPharmacies.push(pharm);
            }
        }
    });

    mockLabs.forEach(lab => {
        if (associatedLabIds.has(lab.id)) {
            if (!filteredLabs.some(l => l.id === lab.id)) {
                filteredLabs.push(lab);
            }
        }
    });


    return { doctors: filteredDoctors, pharmacies: filteredPharmacies, labs: filteredLabs };

  }, [searchTerm, clinics]);
  
  
  const getAssociatedItems = (doctorId: string) => {
    const associatedPharmacies = new Set<Pharmacy>();
    const associatedLabs = new Set<Lab>();

    clinics.forEach(clinic => {
        if (clinic.doctorId === doctorId) {
            clinic.associatedPharmacyIds?.forEach(id => {
                const pharmacy = mockPharmacies.find(p => p.id === id);
                if (pharmacy) associatedPharmacies.add(pharmacy);
            });
            clinic.associatedLabIds?.forEach(id => {
                const lab = mockLabs.find(l => l.id === id);
                if (lab) associatedLabs.add(lab);
            });
        }
    });
    return {
        pharmacies: Array.from(associatedPharmacies),
        labs: Array.from(associatedLabs)
    };
  }

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
                                    const associations = getAssociatedItems(doctor.id);
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
                                                {(associations.pharmacies.length > 0 || associations.labs.length > 0) && (
                                                    <div>
                                                        <h4 className="font-semibold mb-2 text-sm flex items-center gap-2"><LinkIcon/> Associated With</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {associations.pharmacies.map(p => <Badge key={p.id} variant="secondary" className="bg-emerald-100 text-emerald-800"><Pill className="w-3 h-3 mr-1"/>{p.name}</Badge>)}
                                                            {associations.labs.map(l => <Badge key={l.id} variant="secondary" className="bg-sky-100 text-sky-800"><FlaskConical className="w-3 h-3 mr-1"/>{l.name}</Badge>)}
                                                        </div>
                                                    </div>
                                                )}
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
                                    <Card key={pharmacy.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                        <div className="relative w-full h-40">
                                            <Image src={pharmacy.image} alt={pharmacy.name} fill style={{objectFit:"cover"}} data-ai-hint={pharmacy.dataAiHint} />
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="font-headline text-xl">{pharmacy.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                <MapPin className="w-4 h-4"/> 
                                                <span>{pharmacy.location} ({pharmacy.distance})</span>
                                            </div>
                                            <Button className="w-full mt-4" variant="outline">View Details</Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                     )}
                      {labs.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2"><FlaskConical/> Labs</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {labs.map((lab) => (
                                    <Card key={lab.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                        <div className="relative w-full h-40">
                                            <Image src={lab.image} alt={lab.name} fill style={{objectFit:"cover"}} data-ai-hint={lab.dataAiHint} />
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="font-headline text-xl">{lab.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                <MapPin className="w-4 h-4"/> 
                                                <span>{lab.location} ({lab.distance})</span>
                                            </div>
                                            <Button className="w-full mt-4" variant="outline">View Services</Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                     )}
                     {doctors.length === 0 && pharmacies.length === 0 && labs.length === 0 && (
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
                placeholder="Search by doctor, specialty, pharmacy, or lab name..."
                className="pl-10 text-base py-6"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        {renderContent()}
    </div>
  );
}

