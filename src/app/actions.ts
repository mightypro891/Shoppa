
// Client-side wrappers around server actions (Genkit AI flows).
// These call the flows in src/server/ai/flows directly — no separate
// backend deployment is required.

import { suggestRecipes, type RecipeSuggestionsInput } from '@/server/ai/flows/recipe-suggestions';
import { sendOrderConfirmation } from '@/server/ai/flows/send-order-confirmation';
import { askSupportAgent } from '@/server/ai/flows/support-chat-flow';
import { generateStory, type StoryGenerationInput } from '@/server/ai/flows/story-generation-flow';

export async function getRecipeSuggestionsAction(input: RecipeSuggestionsInput) {
  return suggestRecipes(input);
}

type SendOrderConfirmationActionInput = {
  orderId: string;
  customer: { name: string; email: string };
  cartItems: { name: string; quantity: number; price: number }[];
  subTotal: number;
  deliveryFee: number;
  total: number;
};

export async function sendOrderConfirmationAction(input: SendOrderConfirmationActionInput) {
  try {
    return await sendOrderConfirmation({
      orderId: input.orderId,
      customerName: input.customer.name,
      customerEmail: input.customer.email,
      cartItems: input.cartItems.map(({ name, quantity, price }) => ({ name, quantity, price })),
      subTotal: input.subTotal,
      deliveryFee: input.deliveryFee,
      total: input.total,
    });
  } catch (err) {
    console.error('Order confirmation error:', err);
    return { sent: false };
  }
}

type AskSupportAgentActionInput = {
  question: string;
  products?: unknown;
  lastOrder?: unknown;
};

export async function askSupportAgentAction(input: AskSupportAgentActionInput) {
  try {
    return await askSupportAgent({ userMessage: input.question });
  } catch (err) {
    console.error(err);
    return { answer: "I'm sorry, I'm having trouble connecting right now. Please try again later." };
  }
}

export async function generateStoryAction(input: StoryGenerationInput) {
  try {
    return await generateStory(input);
  } catch (err) {
    console.error(err);
    return { story: "The storyteller seems to be taking a nap. Please try again in a moment." };
  }
}
