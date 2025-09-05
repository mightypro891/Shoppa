
'use client';

import { useWishlist } from '@/context/WishlistContext';
import { getProducts } from '@/lib/data';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/products/ProductCard';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const { user, loading: authLoading } = useAuth();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
     if (!authLoading && !user) {
      router.push('/auth/signin?redirect=/wishlist');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      const prods = await getProducts();
      setAllProducts(prods);
      setLoading(false);
    };
    fetchAllProducts();
  }, []);

  const wishlistProducts = allProducts.filter(p => wishlist.includes(p.id));

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 font-headline">My Wishlist</h1>
      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Heart className="mx-auto h-24 w-24 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-semibold">Your wishlist is empty</h2>
          <p className="mt-2 text-muted-foreground">
            Click the heart icon on products to save them for later.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Start Browsing</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
