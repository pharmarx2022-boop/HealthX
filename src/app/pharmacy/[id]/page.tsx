
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Loader2, PercentCircle, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { initialPharmacies } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const PHARMACIES_KEY = 'mockPharmacies';

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

export default function PharmacyDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [isClient, setIsClient] = useState(false);
  const [pharmacies, setPharmacies] = useState(initialPharmacies);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedPharmacies = sessionStorage.getItem(PHARMACIES_KEY);
      if (storedPharmacies) {
        setPharmacies(JSON.parse(storedPharmacies));
      } else {
        sessionStorage.setItem(PHARMACIES_KEY, JSON.stringify(initialPharmacies));
      }
    }
  }, []);

  const pharmacy = pharmacies.find(d => d.id === id);

  if (!isClient) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-slate-50/50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary"/>
                <p className="ml-4 text-muted-foreground">Loading pharmacy profile...</p>
            </main>
            <Footer />
        </div>
    );
  }

  if (!pharmacy) {
    notFound();
    return null;
  }
  
  const totalReviews = pharmacy.reviewsList?.length ?? 0;
  const averageRating = totalReviews > 0
    ? (pharmacy.reviewsList.reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(1)
    : 'N/A';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
            <Card className="max-w-4xl mx-auto shadow-lg">
                <div className="p-6">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                       <Image src={pharmacy.image} alt={pharmacy.name} fill style={{objectFit:"cover"}} data-ai-hint="pharmacy exterior" />
                    </div>
                </div>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">{pharmacy.name}</CardTitle>
                    <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="font-bold">{averageRating}</span>
                        </div>
                        <span className="text-muted-foreground">({totalReviews} reviews)</span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="flex items-center text-muted-foreground gap-2">
                        <MapPin className="w-5 h-5"/> 
                        <span>{pharmacy.location}</span>
                         <Link href={`https://www.google.com/maps?q=${encodeURIComponent(pharmacy.location)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:underline">
                            <LinkIcon className="w-4 h-4 ml-1" />
                            <span className="ml-1">View on Map</span>
                        </Link>
                    </div>
                    {pharmacy.acceptsHealthPoints && (
                        <Badge className="mt-4" variant="secondary">
                            <PercentCircle className="mr-2 text-primary" /> Accepts Health Points ({pharmacy.discount}%)
                        </Badge>
                    )}
                   
                    <Button asChild size="lg" className="w-full mt-4">
                        <a href={`https://wa.me/${pharmacy.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                            <WhatsAppIcon />
                            <span className="ml-2">Contact on WhatsApp</span>
                        </a>
                    </Button>
                </CardContent>
                 <Separator/>
                 <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Patient Reviews</h3>
                    {pharmacy.reviewsList && pharmacy.reviewsList.length > 0 ? (
                        <div className="space-y-6">
                            {pharmacy.reviewsList.map((review, index) => (
                                <div key={index} className="flex gap-4">
                                    <Avatar>
                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${review.patientName}`} alt={review.patientName} />
                                        <AvatarFallback>{review.patientName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold">{review.patientName}</p>
                                            <div className="flex items-center gap-1 text-amber-500">
                                                 {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground mt-1">{review.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No reviews yet.</p>
                    )}
                 </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
