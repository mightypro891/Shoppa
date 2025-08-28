'use client';

import Link from 'next/link';
import { ShoppingCart, Soup, Menu, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { itemCount } = useCart();
  const categories = ["fishes", "grains", "oils", "swallows", "plantain"];


  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Soup className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl font-headline tracking-tight">
              Naija Shoppa
            </span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1 hidden md:flex">
                Categories <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                  <Link href="/products">All Products</Link>
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem key={category} asChild>
                  <Link href={`/products/category/${category}`} className="capitalize">{category}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

        </div>

        <nav className="flex items-center gap-2">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
               <DropdownMenuItem asChild>
                  <Link href="/products">All Products</Link>
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem key={category} asChild>
                  <Link href={`/products/category/${category}`} className="capitalize">{category}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
