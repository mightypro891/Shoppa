
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
     <Button onClick={handleAddToCart} size="sm" variant="outline" className="text-primary hover:bg-primary hover:text-primary-foreground border-primary border-2">
        <ShoppingCart className="mr-2 h-4 w-4" />
        Add to Cart
    </Button>
  )
}
