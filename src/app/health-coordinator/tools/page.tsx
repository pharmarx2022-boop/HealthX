
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Bot, Beaker } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { suggestTestsForPatients } from '@/ai/flows/suggest-test-flow';
import type { TestSuggestion } from '@/ai/schemas/test-suggestion-schema';
import { BottomNavBar } from '@/components/layout/bottom-nav-bar';

const AITestSuggestions = () => {
    const [suggestions, setSuggestions] = useState<TestSuggestion[]>([]);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleGetSuggestions = () => {
        startTransition(async () => {
            try {
                const result = await suggestTestsForPatients();
                setSuggestions(result);
                 toast({
                    title: "Suggestions Generated",
                    description: `Found ${result.length} test suggestions for your patients.`
                });
            } catch (e) {
                console.error(e);
                toast({
                    title: "Error fetching suggestions",
                    description: e instanceof Error ? e.message : "An unknown error occurred.",
                    variant: "destructive"
                });
            }
        });
    }

    return (
         <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4">
                <Bot className="w-8 h-8 text-primary"/>
                <div>
                    <CardTitle>AI Test Suggestions</CardTitle>
                    <CardDescription>
                        Get AI-powered recommendations for patient lab tests based on their history.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {suggestions.length > 0 ? (
                    <div className="space-y-4">
                        {suggestions.map((suggestion, index) => (
                            <Card key={index} className="bg-slate-50">
                                <CardContent className="p-4">
                                    <p className="font-semibold">{suggestion.patientName}</p>
                                    <p><span className="font-medium">Suggested Test:</span> {suggestion.suggestedTest}</p>
                                    <p className="text-sm text-muted-foreground"><span className="font-medium">Reason:</span> {suggestion.reason}</p>
                                    <Button asChild size="sm" className="mt-2">
                                        <Link href="/book-appointment?service=lab">
                                            <Beaker className="mr-2 h-4 w-4"/> Book Lab Test
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-4">
                       Click the button to generate test suggestions for your patients.
                    </div>
                )}
            </CardContent>
             <CardFooter>
                 <Button onClick={handleGetSuggestions} disabled={isPending} className="w-full">
                    {isPending ? <Loader2 className="animate-spin mr-2"/> :  <Bot className="mr-2" />}
                    {suggestions.length > 0 ? 'Refresh Suggestions' : 'Get Suggestions'}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default function HealthCoordinatorToolsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-slate-50/50 pb-20 md:pb-0">
                <div className="container mx-auto py-12">
                     <div className="mb-8">
                        <h1 className="text-3xl font-headline font-bold">AI Tools</h1>
                        <p className="text-muted-foreground">Leverage AI to provide better assistance to your patients.</p>
                    </div>
                    <AITestSuggestions />
                </div>
            </main>
            <Footer />
            <BottomNavBar />
        </div>
    );
}
