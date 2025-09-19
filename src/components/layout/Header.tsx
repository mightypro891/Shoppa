
'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, LogOut, User as UserIcon, Shield, Settings, Wallet, Search, Heart, X, Info } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRouter } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';
import { ModeToggle } from './ModeToggle';
import { Input } from '../ui/input';
import { useEffect, useState, useRef } from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '../ui/navigation-menu';
import React from 'react';
import { cn } from '@/lib/utils';
import { mainCategories, type Category } from '@/lib/categories';
import StoreLogo from './StoreLogo';


export default function Header() {
  const { itemCount } = useCart();
  const { user, isAdmin, loading, accountBalance, logOut } = useAuth();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);


  const handleSignOut = async () => {
    logOut();
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
      setIsSearchOpen(false);
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

  const allCategorySlugs = mainCategories.flatMap(cat => [cat.slug, ...(cat.subcategories?.map(sub => sub.slug) || [])]);

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 gap-4">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center gap-2">
            <StoreLogo className="h-7 w-auto" />
            <span className="font-bold text-xl font-headline tracking-tight hidden sm:inline">
              Lautech Shoppa
            </span>
          </Link>
           <nav className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/products" className={navigationMenuTriggerStyle()}>All Products</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid grid-cols-3 gap-x-6 gap-y-4 p-6 w-[750px] lg:w-[900px]">
                        {mainCategories.map((category) => (
                          <div key={category.slug} className="flex flex-col space-y-2">
                            <NavigationMenuLink asChild>
                                <Link href={`/products/category/${category.slug}`} className="font-semibold text-base mb-1 pb-1 border-b border-primary/50 hover:text-primary transition-colors">
                                    {category.name}
                                </Link>
                            </NavigationMenuLink>
                            <ul className="flex flex-col gap-1.5">
                                {category.subcategories?.map(subcategory => (
                                    <li key={subcategory.slug}>
                                        <NavigationMenuLink asChild>
                                            <Link href={`/products/category/${subcategory.slug}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                                {subcategory.name}
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                 <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/about" className={navigationMenuTriggerStyle()}>About Us</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>


        <div className="flex items-center gap-1 sm:gap-2">
           <div className="relative w-full max-w-md hidden md:block">
              <form onSubmit={handleSearch} className={cn("w-full transition-all duration-300")}>
                <Input name="q" placeholder="Search for products..." className="pr-10 bg-secondary/50" />
                 <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                    <Search className="h-4 w-4" />
                </Button>
              </form>
           </div>


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
                      {mainCategories.map((category) => (
                         <DropdownMenuItem key={category.slug} asChild>
                             <Link href={`/products/category/${category.slug}`}>{category.name}</Link>
                         </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
               </DropdownMenuSub>
               <DropdownMenuItem asChild>
                  <Link href="/about"><Info className="mr-2 h-4 w-4" />About Us</Link>
              </DropdownMenuItem>
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
          
           <Button onClick={() => setIsSearchOpen(true)} variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
            </Button>
           
           {isSearchOpen && (
               <div className="absolute top-0 left-0 w-full h-full bg-background z-50 flex items-center px-4 md:hidden">
                 <form onSubmit={handleSearch} className="w-full">
                   <Input ref={searchInputRef} name="q" placeholder="Search for products..." className="pr-10" />
                 </form>
                  <Button type="button" variant="ghost" size="icon" className="absolute right-4" onClick={() => setIsSearchOpen(false)}>
                     <X className="h-5 w-5" />
                 </Button>
               </div>
           )}


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
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem disabled>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem asChild>
                        <Link href="/fund-wallet">
                          <Wallet className="mr-2 h-4 w-4" />
                          <span>Fund Wallet (₦{accountBalance.toFixed(2)})</span>
                        </Link>
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
                        <Link href="/wishlist"><Heart className="mr-2 h-4 w-4" />My Wishlist</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/about"><Info className="mr-2 h-4 w-4" />About Us</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
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
        </div>
      </div>
    </header>
  );
}
