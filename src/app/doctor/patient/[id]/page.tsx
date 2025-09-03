
'use client';

import { notFound, useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Calendar, Clock, Stethoscope, FileText, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { mockPatients } from '@/components/doctor/patient-list';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function PatientDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const patient = mockPatients.find(p => p.id === id);

  if (!patient) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-12">
          <div className="mb-6">
            <Button asChild variant="outline">
              <Link href="/doctor/dashboard">
                <ArrowLeft className="mr-2" />
                Back to Patient List
              </Link>
            </Button>
          </div>

          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline text-3xl">{patient.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1 text-base">
                  Patient ID: {patient.id}
                </CardDescription>
              </div>
              <Badge variant={patient.status === 'done' ? 'secondary' : 'default'} className="text-base">
                {patient.status}
              </Badge>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="font-semibold text-lg border-b pb-2">Appointment Details</h3>
                <div className="flex items-center text-muted-foreground gap-3">
                  <Calendar className="w-5 h-5 text-primary"/> 
                  <span>{format(new Date(patient.appointmentDate), 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center text-muted-foreground gap-3">
                  <Clock className="w-5 h-5 text-primary"/> 
                  <span>{format(new Date(patient.appointmentDate), 'p')}</span>
                </div>
                 <div className="flex items-center text-muted-foreground gap-3">
                  <Stethoscope className="w-5 h-5 text-primary"/> 
                  <span>Clinic: {patient.clinic}</span>
                </div>
              </div>
               <div className="space-y-6">
                <h3 className="font-semibold text-lg border-b pb-2">Consultation Info</h3>
                <div className="flex items-start text-muted-foreground gap-3">
                  <FileText className="w-5 h-5 text-primary mt-1"/> 
                  <div>
                    <p className="font-medium text-foreground">Reason for Visit</p>
                    <p>{patient.consultation}</p>
                  </div>
                </div>
                {patient.notes && (
                    <div className="flex items-start text-muted-foreground gap-3">
                        <MessageSquare className="w-5 h-5 text-primary mt-1"/>
                        <div>
                            <p className="font-medium text-foreground">Doctor's Notes</p>
                            <p>{patient.notes}</p>
                        </div>
                    </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
