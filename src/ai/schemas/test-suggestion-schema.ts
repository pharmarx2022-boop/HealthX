
import { z } from 'genkit';

/**
 * @fileOverview Defines the Zod schema and TypeScript type for AI-powered test suggestions.
 * 
 * - TestSuggestionSchema - The Zod schema for a single test suggestion.
 * - TestSuggestion - The TypeScript type inferred from the schema.
 */

export const TestSuggestionSchema = z.object({
    patientName: z.string().describe("The full name of the patient."),
    suggestedTest: z.string().describe("The specific lab test being recommended (e.g., 'Thyroid Function Test', 'Complete Blood Count')."),
    reason: z.string().describe("A brief, clear justification for why the test is being suggested, based on the patient's consultation notes."),
});

export type TestSuggestion = z.infer<typeof TestSuggestionSchema>;
