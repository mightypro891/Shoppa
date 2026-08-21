
'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { generateStoryAction } from '@/app/actions';

interface ProductStoryGeneratorProps {
  productName: string;
  productDescription: string;
}

export default function ProductStoryGenerator({ productName, productDescription }: ProductStoryGeneratorProps) {
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateStory = async () => {
    setLoading(true);
    setStory('');
    const result = await generateStoryAction({ productName, productDescription });
    setStory(result.story);
    setLoading(false);
  };

  return (
    <Card className="bg-secondary/30 border-dashed max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
           <Sparkles className="w-6 h-6 text-primary" />
           The Story of {productName}
        </CardTitle>
        <CardDescription>Want to hear a tale about this product? Click the button!</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Our storyteller is weaving a tale...</p>
          </div>
        ) : story ? (
          <p className="text-muted-foreground whitespace-pre-line text-left md:text-center italic">{story}</p>
        ) : (
          <Button onClick={handleGenerateStory}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Story
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
