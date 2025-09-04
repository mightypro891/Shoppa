
'use server';
/**
 * @fileOverview An AI flow to generate a creative story about a product.
 *
 * - generateStory - A function that creates a short story for a given product.
 * - StoryGenerationInput - The input type for the generateStory function.
 * - StoryGenerationOutput - The return type for the generateStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StoryGenerationInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('The description of the product.'),
});
export type StoryGenerationInput = z.infer<typeof StoryGenerationInputSchema>;

const StoryGenerationOutputSchema = z.object({
  story: z.string().describe("A short, creative, and engaging story about the product's origin or significance. The story should be suitable for a Nigerian audience."),
});
export type StoryGenerationOutput = z.infer<typeof StoryGenerationOutputSchema>;

export async function generateStory(input: StoryGenerationInput): Promise<StoryGenerationOutput> {
  return storyGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'storyGenerationPrompt',
  input: {schema: StoryGenerationInputSchema},
  output: {schema: StoryGenerationOutputSchema},
  prompt: `You are a master storyteller, a Nigerian griot who weaves captivating tales.
  
  A user wants to hear a short, imaginative story about a product. The story should be about 2-3 paragraphs long.
  Base the story on the product's name and description. Make it magical, funny, or heroic.
  The story should feel like a local Nigerian folktale.

  Product Name: {{{productName}}}
  Description: {{{productDescription}}}
  
  Craft your story below.
  `,
});

const storyGenerationFlow = ai.defineFlow(
  {
    name: 'storyGenerationFlow',
    inputSchema: StoryGenerationInputSchema,
    outputSchema: StoryGenerationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
