
'use server';

/**
 * @fileOverview A flow for admin-assisted refunds, allowing admins to quickly look up user consultation history and wallet balance using AI.
 *
 * - adminAssistedRefund - A function that handles the admin-assisted refund process.
 * - AdminAssistedRefundInput - The input type for the adminAssistedRefund function.
 * - AdminAssistedRefundOutput - The return type for the adminAssistedRefund function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { mockPatientData } from '@/lib/mock-data';
import { getTransactionHistory } from '@/lib/transactions';

const AdminAssistedRefundInputSchema = z.object({
  userId: z.string().describe('The ID of the user requesting the refund.'),
  refundAmount: z.number().describe('The amount to be refunded.'),
  reason: z.string().describe('The reason for the refund request.'),
});
export type AdminAssistedRefundInput = z.infer<typeof AdminAssistedRefundInputSchema>;

const AdminAssistedRefundOutputSchema = z.object({
  consultationHistorySummary: z
    .string()
    .describe('A summary of the user consultation history.'),
  walletBalance: z.number().describe('The current wallet balance of the user.'),
  verificationResult: z
    .string()
    .describe('The verification result of the refund amount.'),
  approvalMessage: z.string().describe('Message to display to the admin regarding the approval.'),
});
export type AdminAssistedRefundOutput = z.infer<typeof AdminAssistedRefundOutputSchema>;

export async function adminAssistedRefund(input: AdminAssistedRefundInput): Promise<AdminAssistedRefundOutput> {
  return adminAssistedRefundFlow(input);
}

const refundVerificationPrompt = ai.definePrompt({
  name: 'refundVerificationPrompt',
  input: {schema: z.object({ ...AdminAssistedRefundInputSchema.shape, consultationHistorySummary: z.string(), walletBalance: z.number() })},
  output: {schema: AdminAssistedRefundOutputSchema},
  prompt: `You are an administrative assistant helping to verify refund requests.

  Based on the user's consultation history, current wallet balance, and the refund reason, determine if the refund amount is appropriate. Display a approval message to the admin regarding the approval.

  User ID: {{{userId}}}
  Refund Amount: INR {{{refundAmount}}}
  Reason: {{{reason}}}

  Consultation History: {{{consultationHistorySummary}}}
  Wallet Balance: INR {{{walletBalance}}}

  Verification Result: `,
});

const getUserConsultationHistory = ai.defineTool({
  name: 'getUserConsultationHistory',
  description: 'Retrieves a summary of the user consultation history.',
  inputSchema: z.object({
    userId: z.string().describe('The ID of the user.'),
  }),
  outputSchema: z.string(),
},
async (input) => {
    const allAppointments = JSON.parse(localStorage.getItem('mockPatients') || '[]');
    const userAppointments = allAppointments.filter((appt: any) => appt.id === input.userId || appt.name === input.userId); // Loosely match by name for demo
    if (userAppointments.length > 0) {
        return userAppointments.map((appt: any) => `Consulted on ${appt.appointmentDate} for ${appt.consultation}. Paid INR ${appt.consultationFee}.`).join(' ');
    }
    return `No consultation history found for user ${input.userId}.`;
  }
);

const getUserWalletBalance = ai.defineTool({
  name: 'getUserWalletBalance',
  description: 'Retrieves the current wallet balance of the user.',
  inputSchema: z.object({
    userId: z.string().describe('The ID of the user.'),
  }),
  outputSchema: z.number(),
},
async (input) => {
    const { balance } = getTransactionHistory(input.userId);
    return balance;
  }
);

const adminAssistedRefundFlow = ai.defineFlow(
  {
    name: 'adminAssistedRefundFlow',
    inputSchema: AdminAssistedRefundInputSchema,
    outputSchema: AdminAssistedRefundOutputSchema,
  },
  async input => {
    const consultationHistorySummary = await getUserConsultationHistory({userId: input.userId});
    const walletBalance = await getUserWalletBalance({userId: input.userId});

    const {output} = await refundVerificationPrompt({
      ...input,
      consultationHistorySummary,
      walletBalance,
    });
    return output!;
  }
);
