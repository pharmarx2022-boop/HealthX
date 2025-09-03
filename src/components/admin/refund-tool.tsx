
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminAssistedRefund, type AdminAssistedRefundOutput } from '@/ai/flows/admin-assisted-refund';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Bot, User, Wallet, History, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const refundSchema = z.object({
  userId: z.string().min(1, 'User ID is required.'),
  refundAmount: z.coerce.number().positive('Refund amount must be a positive number.'),
  reason: z.string().min(10, 'Please provide a detailed reason (min. 10 characters).'),
});

export function RefundTool() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AdminAssistedRefundOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof refundSchema>>({
    resolver: zodResolver(refundSchema),
    defaultValues: {
      userId: '',
      refundAmount: 0,
      reason: '',
    },
  });

  const handleAction = async (values: z.infer<typeof refundSchema>) => {
    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const response = await adminAssistedRefund(values);
        setResult(response);
        toast({
            title: "Verification Complete",
            description: "AI analysis is ready for your review.",
        });
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAction)} className="space-y-6">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., user_abc123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="refundAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Refund Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Refund</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the reason for the refund request..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="animate-spin" /> : <Bot className="mr-2" />}
              Verify with AI
            </Button>
          </form>
        </Form>
      </div>
      
      <div className="flex items-center justify-center">
        {isPending && (
            <div className="text-center text-muted-foreground">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4"/>
                <p>Analyzing user data and verifying request...</p>
            </div>
        )}
        {error && <p className="text-destructive">Error: {error}</p>}
        {result && (
          <Card className="w-full bg-white animate-in fade-in-50">
            <CardHeader>
              <CardTitle>AI Verification Result</CardTitle>
              <CardDescription>Review the AI-generated summary before approving the refund.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <History className="w-5 h-5 mt-1 text-primary"/>
                    <div>
                        <h4 className="font-semibold">Consultation History</h4>
                        <p className="text-sm text-muted-foreground">{result.consultationHistorySummary}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <Wallet className="w-5 h-5 mt-1 text-primary"/>
                    <div>
                        <h4 className="font-semibold">Current Wallet Balance</h4>
                        <p className="text-sm text-muted-foreground">₹{result.walletBalance.toFixed(2)}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 mt-1 text-primary"/>
                    <div>
                        <h4 className="font-semibold">Verification</h4>
                        <p className="text-sm text-muted-foreground">{result.verificationResult}</p>
                    </div>
                </div>
                <Card className="bg-accent/20 border-accent">
                    <CardHeader className="flex-row items-center gap-3 space-y-0">
                        <Bot className="w-6 h-6 text-accent"/>
                        <CardTitle className="text-accent font-headline">AI Approval Message</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-medium">{result.approvalMessage}</p>
                        <div className="mt-4 flex gap-4">
                            <Button>Approve Refund</Button>
                            <Button variant="outline">Reject</Button>
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
