
export type MockReport = {
    id: string;
    patientId: string;
    name: string;
    lab: string;
    date: string;
    file: string; // URL or path to the file
};

// These are now placeholders. In a real app, this data would come from a database.
export const initialDoctors: any[] = [];
export const initialClinics: any[] = [];
export const initialPharmacies: any[] = [];
export const initialLabs: any[] = [];
export const mockPatientData: any[] = [];
export const mockReports: MockReport[] = [];
