'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCart } from '@/context/CartContext';
import { getRecipeSuggestionsAction } from '@/app/actions';
import { Loader2, Sparkles } from 'lucide-react';
import type { RecipeSuggestionsOutput } from '@/ai/flows/recipe-suggestions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export default function RecipeSuggestions() {
  const { cartItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<RecipeSuggestionsOutput['recipes'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleGetRecipes = async () => {
    setLoading(true);
    setError(null);
    setRecipes(null);

    const itemNames = cartItems.map(item => item.name);
    
    try {
      const result = await getRecipeSuggestionsAction({ cartItems: itemNames });
      if (result && result.recipes) {
        setRecipes(result.recipes);
      } else {
        setError('Could not generate recipes at this time. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4 border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={handleGetRecipes}>
          <Sparkles className="mr-2 h-4 w-4" />
          Get Recipe Ideas
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
             <Sparkles className="mr-2 h-5 w-5 text-primary" />
            Recipe Suggestions
          </DialogTitle>
          <DialogDescription>
            Based on your cart, here are some Nigerian dishes you can make.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
               <p className="ml-4 text-muted-foreground">Generating recipes...</p>
            </div>
          )}
          {error && <p className="text-destructive text-center">{error}</p>}
          {recipes && (
            <Accordion type="single" collapsible className="w-full">
              {recipes.map((recipe, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="font-semibold">{recipe.name}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Ingredients:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Instructions:</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{recipe.instructions}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
