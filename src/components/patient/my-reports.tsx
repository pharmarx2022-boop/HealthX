
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { mockReports } from "@/lib/mock-data";

export type MockReport = {
    id: string;
    patientId: string;
    name: string;
    lab: string;
    date: string;
    file: string; // URL or path to the file
};

const REPORTS_KEY = 'mockReports';

export function MyReports() {
    const { toast } = useToast();
    const [myReports, setMyReports] = useState<MockReport[]>([]);
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const u = JSON.parse(storedUser);
            setUser(u);

            const storedReports = localStorage.getItem(REPORTS_KEY);
            const allReports = storedReports ? JSON.parse(storedReports) : mockReports;
            if (!storedReports) {
                localStorage.setItem(REPORTS_KEY, JSON.stringify(mockReports));
            }
            
            setMyReports(allReports.filter((rep: MockReport) => rep.patientId === u.id));
        }
    }, []);


    const handleDownload = (reportName: string) => {
        toast({
            title: "Downloading Report",
            description: `Your report "${reportName}" is being downloaded. This is a mock action.`
        });
        // In a real app, this would trigger a file download.
    }

    return (
        <div className="space-y-4">
            {myReports.length > 0 ? (
                myReports.map(report => (
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
                <p className="text-muted-foreground text-center py-8">You have no reports available.</p>
            )}
        </div>
    );
}
