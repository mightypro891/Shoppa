
'use client';

import Link from 'next/link';
import { ShoppingCart, Soup, Menu, ChevronDown, LogOut, User as UserIcon, Shield, Settings, Wallet, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRouter } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';
import { ModeToggle } from './ModeToggle';
import { Input } from '../ui/input';
import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '../ui/navigation-menu';
import { cn } from '@/lib/utils';
import React from 'react';

export default function Header() {
  const { itemCount } = useCart();
  const { user, isAdmin, loading, accountBalance } = useAuth();
  const router = useRouter();
  const categories = ['food', 'skin-care', 'gadgets', 'kitchen-utensils', 'beddings', 'home-decors', 'intimate-apparel'];
  const [products, setProducts] = useState<Product[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});


  useEffect(() => {
    const fetchProducts = async () => {
      const prods = await getProducts();
      setProducts(prods);
      
      const byCategory: Record<string, Product[]> = {};
      categories.forEach(category => {
        byCategory[category] = prods.filter(p => p.tags?.includes(category));
      });
      setProductsByCategory(byCategory);
    };
    fetchProducts();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };
  
  const formatCategoryName = (slug: string) => {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('q') as string;
    if (query) {
      router.push(`/products?q=${encodeURIComponent(query)}`);
    }
  };

  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
  >(({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  })
  ListItem.displayName = "ListItem"

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Soup className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl font-headline tracking-tight hidden sm:inline">
              Lautech Shoppa
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/products" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    All Products
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
               <NavigationMenuItem>
                  <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {categories.map((category) => (
                        <ListItem
                          key={category}
                          href={`/products/category/${category}`}
                          title={formatCategoryName(category)}
                        >
                          {productsByCategory[category]?.slice(0, 3).map(p => p.name).join(', ')}...
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="flex-1 max-w-md hidden md:flex">
          <form onSubmit={handleSearch} className="w-full relative">
            <Input name="q" placeholder="Search for products..." className="pr-10" />
            <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <nav className="flex items-center gap-1 sm:gap-2">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <DropdownMenuItem asChild>
                  <Link href="/products">All Products</Link>
              </DropdownMenuItem>
               <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Categories</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {categories.map((category) => (
                         <DropdownMenuSub key={category}>
                            <DropdownMenuSubTrigger>
                                <Link href={`/products/category/${category}`}>{formatCategoryName(category)}</Link>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                               <DropdownMenuSubContent>
                                {productsByCategory[category]?.length > 0 ? productsByCategory[category].map(product => (
                                    <DropdownMenuItem key={product.id} asChild>
                                        <Link href={`/products/${product.id}`}>{product.name}</Link>
                                    </DropdownMenuItem>
                                )) : (
                                    <DropdownMenuItem disabled>No products</DropdownMenuItem>
                                )}
                               </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                         </DropdownMenuSub>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
               </DropdownMenuSub>

              {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin"><Shield className="mr-2 h-4 w-4" />Admin Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
            </DropdownMenuContent>
          </DropdownMenu>

          <ModeToggle />

          <Button asChild variant="ghost" size="icon" className="relative">
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
          
          {loading ? (
             <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-24 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
          ) : user ? (
            <>
               <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                <Link href="/fund-wallet">
                    <Wallet className="mr-2 h-4 w-4" />
                    ₦{accountBalance.toFixed(2)}
                </Link>
               </Button>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                        <AvatarFallback>
                        <UserIcon />
                        </AvatarFallback>
                    </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                          <Link href="/admin"><Shield className="mr-2 h-4 w-4" />Admin Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                        <Link href="/profile"><Settings className="mr-2 h-4 w-4" />Profile Settings</Link>
                    </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                        <Link href="/fund-wallet"><Wallet className="mr-2 h-4 w-4" />Fund Wallet</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
               <Button asChild>
                <Link href="/auth/signin">Login</Link>
              </Button>
               <Button asChild variant="secondary" className="hidden sm:flex">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
       <div className="container px-4 pb-2 md:hidden">
          <form onSubmit={handleSearch} className="w-full relative">
            <Input name="q" placeholder="Search for products..." className="pr-10" />
            <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
    </header>
  );
}
