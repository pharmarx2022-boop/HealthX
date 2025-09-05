
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, KeyRound } from 'lucide-react';

const passwordSchema = z.object({
    password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ['confirmPassword'], // Set the error on the confirmPassword field
});

export default function SetPasswordPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const u = JSON.parse(storedUser);
            // In a real app, we'd check if a password is required/already set.
            // For this demo, we assume if they land here, they need to set one.
            setUser(u);
            setIsLoading(false);
        } else {
            // If no user in session, they shouldn't be here.
            toast({
                title: 'Unauthorized',
                description: 'Please log in to set a password.',
                variant: 'destructive',
            });
            router.push('/');
        }
    }, [router, toast]);
    
    const form = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (values: z.infer<typeof passwordSchema>) => {
        // In a real app, this would be an API call to securely update the user's password.
        console.log('Password set for user:', user.id, 'Password:', values.password);

        toast({
            title: 'Password Set Successfully!',
            description: 'You can now use your password to log in next time.',
        });
        
        // This is where you would redirect the user to their dashboard
        const dashboardPath = user.role === 'admin' ? '/admin' 
                           : user.role === 'patient' ? '/patient/my-health'
                           : `/${user.role}/dashboard`;
                           
        router.push(dashboardPath);
    };

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Loading...</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <Card className="w-full max-w-md mx-auto shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-headline">Create Your Password</CardTitle>
                        <CardDescription>Welcome! Secure your account by creating a password.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input type="password" placeholder="••••••••" {...field} />
                                                    <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm New Password</FormLabel>
                                            <FormControl>
                                                 <div className="relative">
                                                    <Input type="password" placeholder="••••••••" {...field} />
                                                    <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Save Password & Continue"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}
