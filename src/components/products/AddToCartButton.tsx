
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/lib/types';
import { ShoppingCart, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);

    setJustAdded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setJustAdded(false), 1200);
  };

  return (
     <Button
        onClick={handleAddToCart}
        size="sm"
        variant="outline"
        className={cn(
          'text-primary hover:bg-primary hover:text-primary-foreground border-primary border-2 transition-colors',
          justAdded && 'bg-primary text-primary-foreground'
        )}
    >
        {justAdded ? (
          <Check className="mr-2 h-4 w-4 animate-pop" />
        ) : (
          <ShoppingCart className="mr-2 h-4 w-4" />
        )}
        {justAdded ? 'Added!' : 'Add to Cart'}
    </Button>
  )
}
