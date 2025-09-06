
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { getContent, saveContent, type SiteContent } from '@/lib/content';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const contentSchema = z.object({
  vision: z.string().min(10, 'Vision statement is required.'),
  mission: z.string().min(10, 'Mission statement is required.'),
  terms: z.string().min(50, 'Terms of Service content is required.'),
  privacy: z.string().min(50, 'Privacy Policy content is required.'),
});

type ContentFormValues = z.infer<typeof contentSchema>;

export default function ContentManagementPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      vision: '',
      mission: '',
      terms: '',
      privacy: '',
    },
  });

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      const content = await getContent();
      form.reset(content);
      setIsLoading(false);
    };
    loadContent();
  }, [form]);

  const handleFormSubmit = async (data: ContentFormValues) => {
    await saveContent(data);
    toast({ title: 'Content Updated', description: 'The site content has been saved successfully.' });
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-bold">Manage Site Content</h1>
          <p className="text-muted-foreground">Edit key informational pages of the website.</p>
        </div>
        <Card>
            <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Manage Site Content</h1>
        <p className="text-muted-foreground">Edit key informational pages of the website.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>About Us Page</CardTitle>
              <CardDescription>Edit the Vision and Mission statements.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="vision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Our Vision</FormLabel>
                    <FormControl>
                      <Textarea rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Our Mission</FormLabel>
                    <FormControl>
                      <Textarea rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legal Pages</CardTitle>
              <CardDescription>Use Markdown for formatting (e.g., `# Heading`, `*bold*`, `- list item`).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terms of Service</FormLabel>
                    <FormControl>
                      <Textarea rows={15} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="privacy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Privacy Policy</FormLabel>
                    <FormControl>
                      <Textarea rows={15} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Button type="submit" disabled={form.formState.isSubmitting} size="lg">
            {form.formState.isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
            Save All Content
          </Button>
        </form>
      </Form>
    </div>
  );
}
