
'use server';
/**
 * @fileOverview A customer support AI agent for Lautech Shoppa.
 *
 * - askSupportAgent - A function that handles responding to customer queries.
 * - SupportChatInput - The input type for the askSupportAgent function.
 * - SupportChatOutput - The return type for the askSupportAgent function.
 */

import { ai } from '@/ai/genkit';
import { getOrderByUserEmail } from '@/lib/orders';
import { z } from 'zod';
import type { Product } from '@/lib/types';


const SimpleProductSchema = z.object({
    name: z.string(),
    price: z.number(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
});

const SupportChatInputSchema = z.object({
  question: z.string().describe("The customer's question."),
  userEmail: z.string().optional().describe("The email of the logged-in user asking the question."),
  // Pass product data directly to the flow to avoid permission issues.
  products: z.array(SimpleProductSchema).optional().describe("A list of available store products."),
});
export type SupportChatInput = z.infer<typeof SupportChatInputSchema>;

const SupportChatOutputSchema = z.object({
  answer: z.string().describe("The AI agent's answer to the question."),
});
export type SupportChatOutput = z.infer<typeof SupportChatOutputSchema>;


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
        // This is a server-to-server call, so it requires Firestore rules that allow read
        // for authenticated users on the orders collection, which is already set up.
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
    tools: [getOrderStatusTool],
    prompt: `You are a friendly and helpful customer support agent for an online store called "Lautech Shoppa".
    Your goal is to answer customer questions accurately and concisely.

    - Use the provided product list to answer questions about product availability or details. The product list is provided in the 'products' input field.
    - If the user asks about their order status (e.g., "where's my stuff?", "delivery status"), use the 'getOrderStatus' tool.
        - You MUST use the 'userEmail' from the input to call this tool.
        - If the tool returns an order, inform the user of the status of their order (e.g., "Your order #12345 is currently Out for Delivery").
        - If the tool returns nothing, politely inform them you couldn't find any recent orders for their account.
    - Provide brief, helpful answers.
    - If you don't know the answer, politely say that you can't help with that.
    - Do not make up information about products or store policies.
    - The store delivers only within Ogbomoso, Nigeria. Delivery is free and takes 1-2 business days.

    Available Products:
    {{#if products}}
        {{#each products}}
        - Name: {{name}}, Price: {{price}}, Description: {{description}}, Tags: {{join tags ", "}}
        {{/each}}
    {{else}}
        No product information available.
    {{/if}}

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
