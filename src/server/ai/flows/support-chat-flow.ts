'use server';
import { ai } from '@/server/ai/genkit';
import { z } from 'genkit';

const SupportChatInputSchema = z.object({
  userMessage: z.string().describe('The message from the user to the support agent.'),
});
export type SupportChatInput = z.infer<typeof SupportChatInputSchema>;

const SupportChatOutputSchema = z.object({
  answer: z.string().describe('The support agent response.'),
});
export type SupportChatOutput = z.infer<typeof SupportChatOutputSchema>;

export async function askSupportAgent(input: SupportChatInput): Promise<SupportChatOutput> {
  const chatPrompt = ai.definePrompt({
    name: 'supportChatPrompt',
    input: { schema: SupportChatInputSchema },
    output: { schema: SupportChatOutputSchema },
    prompt: `You are a helpful customer support agent. User: {{userMessage}}\nResponse:`,
  });

  const { output } = await chatPrompt(input);
  return output!;
}
