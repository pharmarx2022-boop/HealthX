
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const mockReports: any[] = [];


export function MyReports() {
    const { toast } = useToast();

    const handleDownload = (reportName: string) => {
        toast({
            title: "Downloading Report",
            description: `Your report "${reportName}" is being downloaded. This is a mock action.`
        });
        // In a real app, this would trigger a file download.
    }

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>My Reports</CardTitle>
                <CardDescription>
                    View and download your lab reports.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {mockReports.length > 0 ? (
                        mockReports.map(report => (
                            <div key={report.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/70 border">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-primary" />
                                    <div>
                                        <p className="font-semibold">{report.name}</p>
                                        <p className="text-sm text-muted-foreground">{report.lab} - {format(new Date(report.date), 'PP')}</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => handleDownload(report.name)}>
                                    <Download className="mr-2" />
                                    Download
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center py-4">You have no reports available.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
