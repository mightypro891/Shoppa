'use client';

import Link from 'next/link';
import { ShoppingCart, Soup } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center gap-2">
          <Soup className="h-7 w-7 text-primary" />
          <span className="font-bold text-xl font-headline tracking-tight">
            Naija Shoppa
          </span>
        </Link>
        <nav>
          <Button asChild variant="ghost" className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-6 w-6" />
              <span className="sr-only">Shopping Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
