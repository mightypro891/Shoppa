
'use server';
/**
 * @fileOverview AI-powered recipe suggestion flow based on items in the shopping cart.
 *
 * - suggestRecipes - A function that generates recipe suggestions.
 * - RecipeSuggestionsInput - The input type for the suggestRecipes function.
 * - RecipeSuggestionsOutput - The return type for the suggestRecipes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecipeSuggestionsInputSchema = z.object({
  cartItems: z.array(z.string()).describe('List of names of items in the shopping cart.'),
});
export type RecipeSuggestionsInput = z.infer<typeof RecipeSuggestionsInputSchema>;

const RecipeSuggestionsOutputSchema = z.object({
  recipes: z.array(
    z.object({
      name: z.string().describe('The name of the recipe.'),
      ingredients: z.array(z.string()).describe('List of ingredients required for the recipe.'),
      instructions: z.string().describe('Step-by-step instructions to prepare the recipe.'),
    })
  ).describe('An array of suggested recipes based on the cart items.'),
});
export type RecipeSuggestionsOutput = z.infer<typeof RecipeSuggestionsOutputSchema>;

export async function suggestRecipes(input: RecipeSuggestionsInput): Promise<RecipeSuggestionsOutput> {
  return recipeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recipeSuggestionsPrompt',
  input: {schema: RecipeSuggestionsInputSchema},
  output: {schema: RecipeSuggestionsOutputSchema},
  prompt: `You are a professional chef specializing in Nigerian cuisine.

  Based on the items in the user's shopping cart, suggest recipes they can cook.
  Provide the recipe name, a list of ingredients, and step-by-step instructions.

  Shopping Cart Items: {{cartItems}}
  Recipes:`, 
});

const recipeSuggestionsFlow = ai.defineFlow(
  {
    name: 'recipeSuggestionsFlow',
    inputSchema: RecipeSuggestionsInputSchema,
    outputSchema: RecipeSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
