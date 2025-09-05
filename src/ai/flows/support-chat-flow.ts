
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
import { getOrderByUserEmail } from '@/lib/orders';
import { z } from 'zod';

const SupportChatInputSchema = z.object({
  question: z.string().describe("The customer's question."),
  userEmail: z.string().optional().describe("The email of the logged-in user asking the question."),
});
export type SupportChatInput = z.infer<typeof SupportChatInputSchema>;

const SupportChatOutputSchema = z.object({
  answer: z.string().describe("The AI agent's answer to the question."),
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

const getOrderStatusTool = ai.defineTool(
    {
        name: 'getOrderStatus',
        description: 'Get the status of the most recent order for a specific user.',
        inputSchema: z.object({
            userEmail: z.string().describe("The email address of the user to check the order for.")
        }),
        outputSchema: z.object({
            orderId: z.string(),
            status: z.string(),
            cartTotal: z.number(),
        }).optional()
    },
    async (input) => {
        if (!input.userEmail) return undefined;
        const order = await getOrderByUserEmail(input.userEmail);
        if (order) {
            return { orderId: order.id, status: order.status, cartTotal: order.cartTotal };
        }
        return undefined;
    }
);

const prompt = ai.definePrompt({
    name: 'supportChatPrompt',
    input: { schema: SupportChatInputSchema },
    output: { schema: SupportChatOutputSchema },
    tools: [getStoreProducts, getOrderStatusTool],
    prompt: `You are a friendly and helpful customer support agent for an online store called "Lautech Shoppa".
    Your goal is to answer customer questions accurately and concisely.

    - If the user asks about product availability, use the 'getStoreProducts' tool to check the store's inventory.
    - If the user asks about their order status (e.g., "where's my stuff?", "delivery status"), use the 'getOrderStatus' tool.
        - You MUST use the 'userEmail' from the input to call this tool.
        - If the tool returns an order, inform the user of the status of their order (e.g., "Your order #12345 is currently Out for Delivery").
        - If the tool returns nothing, politely inform them you couldn't find any recent orders for their account.
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
        if (!input.userEmail) {
            const { output } = await prompt({question: input.question});
            return output!;
        }
        const { output } = await prompt(input);
        return output!;
    }
);


export async function askSupportAgent(input: SupportChatInput): Promise<SupportChatOutput> {
    return await supportChatFlow(input);
}
