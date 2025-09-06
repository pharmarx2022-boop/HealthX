
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactForm } from '@/components/home/contact-form';

export default function ContactUsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50 flex items-center">
        <div className="container mx-auto py-16">
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline">Contact Us</CardTitle>
              <CardDescription>
                Have a question or feedback? We'd love to hear from you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
