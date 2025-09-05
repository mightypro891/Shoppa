
'use server';
/**
 * @fileOverview A customer support AI agent for Lautech Shoppa.
 *
 * - askSupportAgent - A function that handles responding to customer queries.
 * - SupportChatInput - The input type for the askSupportAgent function.
 * - SupportChatOutput - The return type for the askSupportAgent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SimpleProductSchema = z.object({
    name: z.string(),
    price: z.number(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
});

const SimpleOrderSchema = z.object({
    id: z.string(),
    status: z.string(),
    cartTotal: z.number(),
}).optional();


const SupportChatInputSchema = z.object({
  question: z.string().describe("The customer's question."),
  products: z.array(SimpleProductSchema).optional().describe("A list of available store products."),
  lastOrder: SimpleOrderSchema.describe("The user's most recent order details, if available."),
});
export type SupportChatInput = z.infer<typeof SupportChatInputSchema>;

const SupportChatOutputSchema = z.object({
  answer: z.string().describe("The AI agent's answer to the question."),
});
export type SupportChatOutput = z.infer<typeof SupportChatOutputSchema>;

export async function askSupportAgent(input: SupportChatInput): Promise<SupportChatOutput> {
    return await supportChatFlow(input);
}


const prompt = ai.definePrompt({
    name: 'supportChatPrompt',
    input: { schema: SupportChatInputSchema },
    output: { schema: SupportChatOutputSchema },
    prompt: `You are a friendly and helpful customer support agent for an online store called "Lautech Shoppa".
    Your goal is to answer customer questions accurately and concisely based ONLY on the information provided below.
    Do not use any external knowledge. Do not access any tools.

    - Use the provided product list to answer questions about product availability, price, or details.
    - If the user asks about their order status, use the 'lastOrder' information provided.
        - If an order is present, inform the user of the status (e.g., "Your order #12345 is currently Out for Delivery").
        - If the 'lastOrder' field is not present, or the user asks about an order and you have no info, politely inform them you couldn't find any recent orders for their account.
    - Provide brief, helpful answers.
    - If you don't know the answer based on the context, politely say that you can't help with that or don't have that information.
    - Do not make up information about products or store policies.
    - The store delivers only within Ogbomoso, Nigeria. Delivery is free and takes 1-2 business days.

    CONTEXT:
    ========
    Available Products:
    {{#if products}}
        {{#each products}}
        - Name: {{name}}, Price: {{price}}, Description: {{description}}, Tags: {{#if tags}}{{join tags ", "}}{{/if}}
        {{/each}}
    {{else}}
        No product information available.
    {{/if}}

    User's Last Order:
    {{#if lastOrder}}
        Order ID: {{lastOrder.id}}
        Status: {{lastOrder.status}}
        Total: {{lastOrder.cartTotal}}
    {{else}}
        No recent order information available for this user.
    {{/if}}
    ========

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
