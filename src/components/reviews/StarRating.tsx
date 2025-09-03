
'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  readOnly?: boolean;
}

export default function StarRating({ rating, setRating, readOnly = false }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            className={`
              ${readOnly ? 'cursor-default' : 'cursor-pointer'}
              ${ratingValue <= (hover || rating) ? 'text-primary' : 'text-gray-300'}
            `}
            onClick={() => !readOnly && setRating && setRating(ratingValue)}
            onMouseEnter={() => !readOnly && setHover(ratingValue)}
            onMouseLeave={() => !readOnly && setHover(0)}
            disabled={readOnly}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        );
      })}
    </div>
  );
}
