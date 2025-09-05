
'use client';

import type { Review } from '@/lib/types';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User } from 'lucide-react';
import { format } from 'date-fns';
import StarRating from './StarRating';

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No reviews yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="flex gap-4">
          <Avatar>
            <AvatarImage src={review.authorImage || undefined} alt={review.authorName} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
                <p className="font-semibold">{review.authorName}</p>
                <span className="text-xs text-muted-foreground">
                    {review.createdAt ? format(new Date(review.createdAt), 'MMM d, yyyy') : ''}
                </span>
            </div>
            <div className="my-2">
                 <StarRating rating={review.rating} readOnly />
            </div>
            <p className="text-sm text-muted-foreground">{review.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
