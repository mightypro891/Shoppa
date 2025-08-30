
'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);
  };

  return (
     <Button onClick={handleAddToCart} size="sm" className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary">
        <ShoppingCart className="mr-2 h-4 w-4" />
        Add to Cart
    </Button>
  )
}
