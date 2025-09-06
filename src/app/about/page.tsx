
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { Target, Eye, Users, Linkedin, Twitter, Instagram } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTeamMembers, type TeamMember } from '@/lib/team-members';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function AboutUsPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTeamMembers(getTeamMembers());
    setIsLoading(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold">About HealthLink Hub</h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
              We are dedicated to revolutionizing the healthcare landscape by creating a truly connected and accessible ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <Card className="shadow-lg">
              <CardHeader className="text-center items-center">
                 <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Eye className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  To create a world where quality healthcare is simple, accessible, and financially rewarding for everyone. We envision a connected digital ecosystem that empowers patients and providers alike, fostering a healthier future for all communities.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader className="text-center items-center">
                 <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Target className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                    To seamlessly connect patients with doctors, pharmacies, and labs on a single, intuitive platform. We are on a mission to revolutionize the healthcare experience through our unique cash-refund and Health Point rewards system, making every interaction within the HealthLink Hub ecosystem both valuable and convenient.
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground mt-2">The minds behind the mission.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}><CardContent className="p-6 space-y-4"><Skeleton className="h-32 w-32 rounded-full mx-auto" /><Skeleton className="h-5 w-3/4 mx-auto" /><Skeleton className="h-4 w-1/2 mx-auto" /><Skeleton className="h-10 w-full mx-auto" /></CardContent></Card>
                ))
              ) : (
                teamMembers.map((member) => (
                  <Card key={member.id} className="text-center hover:shadow-xl transition-shadow flex flex-col">
                    <CardContent className="p-6 flex-grow">
                      <div className="w-32 h-32 rounded-full mx-auto overflow-hidden border-4 border-primary/20 mb-4 relative">
                          <Image src={member.image} alt={member.name} fill className="object-cover" data-ai-hint={member.dataAiHint} />
                      </div>
                      <h3 className="text-xl font-semibold font-headline">{member.name}</h3>
                      <p className="text-primary font-medium">{member.title}</p>
                      <p className="text-muted-foreground mt-2 text-sm">{member.bio}</p>
                    </CardContent>
                    {(member.linkedin || member.twitter || member.instagram) && (
                         <CardFooter className="p-4 border-t bg-slate-50/70 justify-center">
                            <div className="flex gap-4">
                                {member.linkedin && <Link href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Linkedin/></Link>}
                                {member.twitter && <Link href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Twitter/></Link>}
                                {member.instagram && <Link href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Instagram/></Link>}
                            </div>
                        </CardFooter>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
