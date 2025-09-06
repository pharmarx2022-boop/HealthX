
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supportAssistant, type SupportAssistantOutput } from '@/ai/flows/support-assistant-flow';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Bot, User, MessageSquare, ClipboardCopy, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const supportSchema = z.object({
  userId: z.string().min(1, 'User ID is required.'),
  userQuery: z.string().min(10, 'Please enter a detailed query (min. 10 characters).'),
});

// A simple markdown-to-HTML renderer for bullet points
const MarkdownRenderer = ({ content }: { content: string }) => {
    if (!content) return null;
    const lines = content.split('\n').map(line => line.trim());
    return (
        <div className="space-y-2 text-sm text-muted-foreground">
            {lines.map((line, index) => {
                if (line.startsWith('* ')) {
                    return <p key={index} className="flex items-start"><span className="mr-2 mt-1.5">•</span><span>{line.substring(2)}</span></p>;
                }
                if (line.trim() === '') {
                    return <br key={index} />;
                }
                return <p key={index}>{line}</p>;
            })}
        </div>
    );
};


export default function SupportPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SupportAssistantOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof supportSchema>>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      userId: '',
      userQuery: '',
    },
  });
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to Clipboard!" });
  }

  const handleAction = async (values: z.infer<typeof supportSchema>) => {
    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const response = await supportAssistant(values);
        setResult(response);
      } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(errorMessage);
        toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-headline font-bold">AI Support Assistant</h1>
            <p className="text-muted-foreground">Resolve user inquiries quickly with AI-powered insights and replies.</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Submit an Inquiry</CardTitle>
                <CardDescription>Enter the user's ID and their question to get started.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAction)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <FormField
                                control={form.control}
                                name="userId"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>User ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., patient_1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                         <FormField
                            control={form.control}
                            name="userQuery"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>User's Query</FormLabel>
                                <FormControl>
                                    <Textarea rows={4} placeholder="Copy and paste the user's message here..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <Button type="submit" disabled={isPending}>
                            {isPending ? <Loader2 className="animate-spin mr-2" /> : <Bot className="mr-2" />}
                            Get AI Assistance
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

         {isPending && (
            <div className="text-center text-muted-foreground py-12">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4"/>
                <p>Analyzing user data and generating response...</p>
            </div>
        )}
        {error && <p className="text-destructive text-center">Error: {error}</p>}
        {result && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                 <Card className="animate-in fade-in-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User /> User Data Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MarkdownRenderer content={result.userDataSummary} />
                    </CardContent>
                </Card>
                 <Card className="animate-in fade-in-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MessageSquare /> Suggested Reply</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-slate-50 border rounded-md text-sm text-muted-foreground whitespace-pre-wrap">
                            {result.suggestedReply}
                        </div>
                        <div className="flex gap-2">
                             <Button onClick={() => handleCopy(result.suggestedReply)}>
                                <ClipboardCopy className="mr-2 h-4 w-4" /> Copy Text
                            </Button>
                             <Button variant="outline">
                                <Send className="mr-2 h-4 w-4" /> Send Reply
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )}
    </div>
  );
}
