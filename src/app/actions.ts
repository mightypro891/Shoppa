
'use server';

import { suggestRecipes, type RecipeSuggestionsInput, type RecipeSuggestionsOutput } from '@/ai/flows/recipe-suggestions';
import { sendOrderConfirmation, type OrderConfirmationInput } from '@/ai/flows/send-order-confirmation';
import { askSupportAgent, type SupportChatInput, type SupportChatOutput } from '@/ai/flows/support-chat-flow';
import { generateStory, type StoryGenerationInput, type StoryGenerationOutput } from '@/ai/flows/story-generation-flow';
import { headers } from 'next/headers';


export async function getRecipeSuggestionsAction(
  input: RecipeSuggestionsInput
): Promise<RecipeSuggestionsOutput> {
  try {
    const output = await suggestRecipes(input);
    return output;
  } catch (error) {
    console.error('Error in getRecipeSuggestionsAction:', error);
    // In a real app, you might want to return a structured error response
    throw new Error('Failed to get recipe suggestions.');
  }
}

export async function sendOrderConfirmationAction(
  input: OrderConfirmationInput
): Promise<{ success: boolean; error?: string }> {
  try {
    // Authenticated flows are called directly. The auth context is handled automatically.
    await sendOrderConfirmation(input);
    return { success: true };
  } catch (error) {
    console.error('Error in sendOrderConfirmationAction:', error);
    return { success: false, error: 'Failed to send order confirmation.' };
  }
}

export async function askSupportAgentAction(
  input: SupportChatInput
): Promise<SupportChatOutput> {
    try {
        const output = await askSupportAgent(input);
        return output;
    } catch (error) {
        console.error('Error in askSupportAgentAction:', error);
        return { answer: "I'm sorry, I'm having trouble connecting right now. Please try again later." };
    }
}

export async function generateStoryAction(
  input: StoryGenerationInput
): Promise<StoryGenerationOutput> {
    try {
        const output = await generateStory(input);
        return output;
    } catch (error) {
        console.error('Error in generateStoryAction:', error);
        return { story: "The storyteller seems to be taking a nap. Please try again in a moment." };
    }
}
