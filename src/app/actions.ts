
'use server';

import { suggestRecipes, type RecipeSuggestionsInput, type RecipeSuggestionsOutput } from '@/ai/flows/recipe-suggestions';
import { sendOrderConfirmation, type OrderConfirmationInput } from '@/ai/flows/send-order-confirmation';


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
    await sendOrderConfirmation(input);
    return { success: true };
  } catch (error) {
    console.error('Error in sendOrderConfirmationAction:', error);
    return { success: false, error: 'Failed to send order confirmation.' };
  }
}
