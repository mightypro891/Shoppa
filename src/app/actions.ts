'use server';

import { suggestRecipes, type RecipeSuggestionsInput, type RecipeSuggestionsOutput } from '@/ai/flows/recipe-suggestions';

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
