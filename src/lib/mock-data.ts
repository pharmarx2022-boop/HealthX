

// THIS FILE WOULD BE REMOVED IN A PRODUCTION ENVIRONMENT
// It contains mock data for prototyping purposes. In a live application,
// all data would be fetched from a secure backend API and database.

export type MockReport = {
    id: string;
    patientId: string;
    name: string;
    lab: string;
    date: string;
    file: string; // URL or path to the file
};

export const initialDoctors: any[] = [];

export const initialClinics: any[] = [];

export const initialPharmacies: any[] = [];

export const initialLabs: any[] = [];

export const mockPatientData: any[] = [];

export const mockReports: MockReport[] = [];
