
'use server';

/**
 * @fileOverview An AI flow to suggest lab tests for patients based on their recent consultation history.
 * 
 * - suggestTestsForPatients - A function that returns a list of test suggestions.
 * - TestSuggestion - The output type for a single test suggestion.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { mockPatientData } from '@/lib/mock-data';

export const TestSuggestionSchema = z.object({
    patientName: z.string().describe("The full name of the patient."),
    suggestedTest: z.string().describe("The specific lab test being recommended (e.g., 'Thyroid Function Test', 'Complete Blood Count')."),
    reason: z.string().describe("A brief, clear justification for why the test is being suggested, based on the patient's consultation notes."),
});
export type TestSuggestion = z.infer<typeof TestSuggestionSchema>;

export async function suggestTestsForPatients(): Promise<TestSuggestion[]> {
  return suggestTestFlow();
}

const suggestTestPrompt = ai.definePrompt({
    name: 'suggestTestPrompt',
    input: { schema: z.object({ consultationHistory: z.string() }) },
    output: { schema: z.array(TestSuggestionSchema) },
    prompt: `You are an expert medical assistant. Your task is to analyze a list of recent patient consultations and suggest relevant lab tests.
    
    Review the following consultation history. For each patient, if their consultation notes indicate a potential need for a lab test, create a suggestion.
    
    - Do not suggest tests for routine follow-ups unless specific symptoms are mentioned.
    - Focus on clear symptoms or diagnoses that correlate with common lab tests (e.g., fatigue/weight gain -> Thyroid Test, fever/infection -> CBC).
    - Provide a concise reason for each suggestion.
    - If no tests are warranted, return an empty array.

    Consultation History:
    {{{consultationHistory}}}
    `,
});


const suggestTestFlow = ai.defineFlow(
    {
        name: 'suggestTestFlow',
        inputSchema: z.void(),
        outputSchema: z.array(TestSuggestionSchema),
    },
    async () => {
        // In a real app, you would fetch relevant patient data. Here, we use mock data.
        const recentConsultations = mockPatientData.filter(appt => appt.status === 'done');
        
        if (recentConsultations.length === 0) {
            return [];
        }

        const consultationHistory = recentConsultations.map(appt => 
            `- Patient: ${appt.name}, Consultation for: "${appt.consultation}"`
        ).join('\n');

        const { output } = await suggestTestPrompt({ consultationHistory });
        return output ?? [];
    }
);
