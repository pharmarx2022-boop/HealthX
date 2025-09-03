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
  input: {schema: AdminAssistedRefundInputSchema},
  output: {schema: AdminAssistedRefundOutputSchema},
  prompt: `You are an administrative assistant helping to verify refund requests.

  Based on the user's consultation history, current wallet balance, and the refund reason, determine if the refund amount is appropriate. Display a approval message to the admin regarding the approval.

  User ID: {{{userId}}}
  Refund Amount: {{{refundAmount}}}
  Reason: {{{reason}}}

  Consultation History: {{{consultationHistorySummary}}}
  Wallet Balance: {{{walletBalance}}}

  Verification Result: `,
});

// Mock database
const MOCK_USER_DATA: Record<string, { consultationHistory: string[], walletBalance: number }> = {
    'user_abc123': {
        consultationHistory: [
            'Consulted Dr. Sharma for cardiology on 2023-10-15. Paid ₹1200.',
            'Follow-up with Dr. Sharma on 2023-10-22. Paid ₹800.',
            'Consulted Dr. Singh for dermatology on 2023-11-05. Paid ₹1500.'
        ],
        walletBalance: 250,
    },
    'user_def456': {
        consultationHistory: ['No recent consultations.'],
        walletBalance: 1000,
    },
    'user_ghi789': {
        consultationHistory: [
            'Consulted Dr. Patel for pediatrics on 2023-11-10. Paid ₹900.',
        ],
        walletBalance: 50,
    }
}

const getUserConsultationHistory = ai.defineTool({
  name: 'getUserConsultationHistory',
  description: 'Retrieves a summary of the user consultation history.',
  inputSchema: z.object({
    userId: z.string().describe('The ID of the user.'),
  }),
  outputSchema: z.string(),
},
async (input) => {
    const userData = MOCK_USER_DATA[input.userId];
    if (userData) {
      return userData.consultationHistory.join(' ');
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
    const userData = MOCK_USER_DATA[input.userId];
    return userData?.walletBalance ?? 0;
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
