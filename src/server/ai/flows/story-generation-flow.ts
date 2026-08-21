'use server';
import {ai} from '@/server/ai/genkit';
import {z} from 'genkit';

const StoryGenerationInputSchema = z.object({
  productName: z.string(),
  productDescription: z.string().optional(),
});
export type StoryGenerationInput = z.infer<typeof StoryGenerationInputSchema>;

const StoryGenerationOutputSchema = z.object({
  story: z.string(),
});
export type StoryGenerationOutput = z.infer<typeof StoryGenerationOutputSchema>;

export async function generateStory(input: StoryGenerationInput): Promise<StoryGenerationOutput> {
  const prompt = ai.definePrompt({
    name: 'storyGenPrompt',
    input: { schema: StoryGenerationInputSchema },
    output: { schema: StoryGenerationOutputSchema },
    prompt: `Write a short, engaging product story for the product named {{productName}}. Include sensory details and a friendly tone. Description: {{productDescription}}`,
  });

  const { output } = await prompt(input);
  return output!;
}
