

export type MockReport = {
    id: string;
    patientId: string;
    name: string;
    lab: string;
    date: string;
    file: string; // URL or path to the file
};

// These are now placeholders. In a real app, this data would come from a database.
// All initial mock data has been removed to prepare for a live data source.
export const initialDoctors: any[] = [];
export const initialClinics: any[] = [];
export const initialPharmacies: any[] = [];
export const initialLabs: any[] = [];
export const mockPatientData: any[] = [];
export const mockReports: MockReport[] = [];
