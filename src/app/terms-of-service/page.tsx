
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useEffect, useState } from 'react';
import { getContent, type SiteContent } from '@/lib/content';
import { Skeleton } from '@/components/ui/skeleton';

// A simple markdown-to-HTML renderer
const MarkdownRenderer = ({ content }: { content: string }) => {
    if (!content) return null;
    const lines = content.split('\n');
    return (
        <div className="space-y-4 text-muted-foreground">
            {lines.map((line, index) => {
                if (line.startsWith('# ')) {
                    return <h2 key={index} className="text-xl font-bold text-foreground pt-4">{line.substring(2)}</h2>;
                }
                if (line.startsWith('## ')) {
                    return <h3 key={index} className="text-lg font-semibold text-foreground pt-2">{line.substring(3)}</h3>;
                }
                 if (line.startsWith('- ')) {
                    return <p key={index} className="pl-4">{line}</p>; // Simple paragraph for list items
                }
                if (line.trim() === '') {
                    return <br key={index} />;
                }
                return <p key={index}>{line}</p>;
            })}
        </div>
    );
};

export default function TermsOfServicePage() {
    const [content, setContent] = useState<Partial<SiteContent>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            setIsLoading(true);
            const siteContent = await getContent();
            setContent(siteContent);
            setIsLoading(false);
        };
        loadContent();
    }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-50/50">
        <div className="container mx-auto py-16">
           <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
            <h1 className="text-3xl font-headline font-bold mb-6">Terms of Service</h1>
             {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            ) : (
                <MarkdownRenderer content={content.terms || ''} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
