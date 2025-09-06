
'use server';

/**
 * @fileOverview An AI flow to assist admins in resolving user inquiries by providing data summaries and drafting replies.
 *
 * - supportAssistant - A function that handles the support request process.
 * - SupportAssistantInput - The input type for the supportAssistant function.
 * - SupportAssistantOutput - The return type for the supportAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getAllUsersForAdmin, type UserData } from '@/lib/auth';
import { mockPatientData } from '@/lib/mock-data';
import { getTransactionHistory } from '@/lib/transactions';

const SupportAssistantInputSchema = z.object({
  userId: z.string().describe('The ID of the user who has an inquiry.'),
  userQuery: z.string().describe("The user's question or problem."),
});
export type SupportAssistantInput = z.infer<typeof SupportAssistantInputSchema>;

const SupportAssistantOutputSchema = z.object({
  userDataSummary: z.string().describe("A concise summary of the user's key data and recent activity."),
  suggestedReply: z.string().describe('A professionally drafted, empathetic reply to the user that addresses their query.'),
});
export type SupportAssistantOutput = z.infer<typeof SupportAssistantOutputSchema>;

export async function supportAssistant(input: SupportAssistantInput): Promise<SupportAssistantOutput> {
  return supportAssistantFlow(input);
}


// MOCK DATA ACCESS TOOLS
const getUserProfile = ai.defineTool({
  name: 'getUserProfile',
  description: 'Retrieves the basic profile information for a given user ID.',
  inputSchema: z.object({ userId: z.string() }),
  outputSchema: z.custom<UserData>(),
}, async ({ userId }) => {
    // In a real app, this would query a database. We'll use our mock auth function.
    const allUsers = getAllUsersForAdmin();
    const user = allUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    return user;
});

const getUserAppointments = ai.defineTool({
  name: 'getUserAppointments',
  description: "Retrieves a user's appointment history.",
  inputSchema: z.object({ userId: z.string() }),
  outputSchema: z.array(z.any()),
}, async ({ userId }) => {
    // This is simplified. A real app might need to look up by patient name or a dedicated user ID field.
    return mockPatientData.filter(appt => appt.id === userId);
});

const getUserWalletBalance = ai.defineTool({
    name: 'getUserWalletBalance',
    description: "Retrieves a user's current Health Point wallet balance.",
    inputSchema: z.object({ userId: z.string() }),
    outputSchema: z.number(),
}, async ({userId}) => {
    const { balance } = getTransactionHistory(userId);
    return balance;
});


const supportPrompt = ai.definePrompt({
  name: 'supportPrompt',
  input: { schema: z.object({
    userQuery: z.string(),
    profile: z.custom<UserData>(),
    appointments: z.array(z.any()),
    walletBalance: z.number(),
  })},
  output: {schema: SupportAssistantOutputSchema},
  prompt: `You are an expert customer support agent for a healthcare platform named HealthX.
  
  An admin needs help resolving a user inquiry. Your task is to:
  1.  Create a concise, bulleted summary of the user's data for the admin. Include their name, role, status, join date, and a brief overview of their recent activity (appointments, wallet balance).
  2.  Draft a professional, empathetic, and helpful reply to the user. Address their query directly using the provided data. Do not invent information.

  User's Query: {{{userQuery}}}

  --- USER DATA ---
  Profile: {{{JSONstringify profile}}}
  Appointments: {{{JSONstringify appointments}}}
  Wallet Balance: {{{walletBalance}}}
  --- END USER DATA ---
  `,
});

const supportAssistantFlow = ai.defineFlow(
  {
    name: 'supportAssistantFlow',
    inputSchema: SupportAssistantInputSchema,
    outputSchema: SupportAssistantOutputSchema,
  },
  async (input) => {
    // Fetch all user data in parallel
    const [profile, appointments, walletBalance] = await Promise.all([
        getUserProfile({ userId: input.userId }),
        getUserAppointments({ userId: input.userId }),
        getUserWalletBalance({ userId: input.userId }),
    ]);

    // Generate the summary and reply
    const { output } = await supportPrompt({
      ...input,
      profile,
      appointments,
      walletBalance,
    });
    
    return output!;
  }
);
