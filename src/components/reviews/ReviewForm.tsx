
'use client';

import { useAuth } from '@/context/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { addReview } from '@/lib/reviews';
import StarRating from './StarRating';
import Link from 'next/link';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating.'),
  text: z.string().min(10, 'Review must be at least 10 characters.'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productId: string;
}

export default function ReviewForm({ productId }: ReviewFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      text: '',
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    if (!user) return;

    await addReview({
      productId,
      authorName: user.displayName || 'Anonymous',
      authorImage: user.photoURL,
      rating: data.rating,
      text: data.text,
      userId: user.uid
    });

    toast({
      title: 'Review Submitted for Approval',
      description: 'Thank you! Your feedback will be visible after it has been approved by an admin.',
    });

    form.reset();
    // No longer need to router.refresh() since reviews won't show up immediately.
  };

  if (!user) {
    return (
      <div className="text-center text-muted-foreground p-4 border-t">
        Please{' '}
        <Link href="/auth/signin" className="text-primary underline">
          sign in
        </Link>{' '}
        to leave a review.
      </div>
    );
  }

  return (
    <div className="border-t pt-8">
        <h3 className="text-lg font-semibold mb-4">Write Your Own Review</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Rating</FormLabel>
                <FormControl>
                  <StarRating rating={field.value} setRating={(value) => field.onChange(value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Review</FormLabel>
                <FormControl>
                  <Textarea placeholder="Share your thoughts on this product..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Submit Review
          </Button>
        </form>
      </Form>
    </div>
  );
}
