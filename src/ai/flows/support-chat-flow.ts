
'use server';
/**
 * @fileOverview A customer support AI agent for Lautech Shoppa.
 *
 * - askSupportAgent - A function that handles responding to customer queries.
 * - SupportChatInput - The input type for the askSupportAgent function.
 * - SupportChatOutput - The return type for the askSupportAgent function.
 */

import { ai } from '@/ai/genkit';
import { getProducts } from '@/lib/data';
import { z } from 'zod';

const SupportChatInputSchema = z.object({
  question: z.string().describe('The customer\'s question.'),
});
export type SupportChatInput = z.infer<typeof SupportChatInputSchema>;

const SupportChatOutputSchema = z.object({
  answer: z.string().describe('The AI agent\'s answer to the question.'),
});
export type SupportChatOutput = z.infer<typeof SupportChatOutputSchema>;


const getStoreProducts = ai.defineTool(
    {
        name: 'getStoreProducts',
        description: 'Get a list of all available products in the store to answer questions about product availability or details.',
        inputSchema: z.object({
            query: z.string().optional().describe('A search query to filter products by name, description, or tags.')
        }),
        outputSchema: z.array(z.object({
            name: z.string(),
            price: z.number(),
            description: z.string(),
            tags: z.array(z.string()).optional(),
        }))
    },
    async (input) => {
        const products = await getProducts();
        let filteredProducts = products;
        if (input.query) {
            const searchTerm = input.query.toLowerCase();
            filteredProducts = products.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm) ||
                p.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        // Return a simplified product list to the model
        return filteredProducts.map(({ name, price, description, tags }) => ({ name, price, description, tags }));
    }
);


const prompt = ai.definePrompt({
    name: 'supportChatPrompt',
    input: { schema: SupportChatInputSchema },
    output: { schema: SupportChatOutputSchema },
    tools: [getStoreProducts],
    prompt: `You are a friendly and helpful customer support agent for an online store called "Lautech Shoppa".
    Your goal is to answer customer questions accurately and concisely.

    - If the user asks about product availability, use the 'getStoreProducts' tool to check the store's inventory.
    - Provide brief, helpful answers.
    - If you don't know the answer, politely say that you can't help with that.
    - Do not make up information about products or store policies.
    - The store delivers only within Ogbomoso, Nigeria. Delivery is free and takes 1-2 business days.

    Customer question: {{{question}}}
    `,
});


const supportChatFlow = ai.defineFlow(
    {
        name: 'supportChatFlow',
        inputSchema: SupportChatInputSchema,
        outputSchema: SupportChatOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);


export async function askSupportAgent(input: SupportChatInput): Promise<SupportChatOutput> {
    return await supportChatFlow(input);
}
