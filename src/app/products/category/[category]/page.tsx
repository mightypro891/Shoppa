
'use client';

import AppLayout from '@/app/(app)/layout';
import { getProducts } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const { userProfile, profileLoading } = useAuth();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category || profileLoading) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await getProducts(userProfile?.campus);
        const decodedCategory = decodeURIComponent(category).toLowerCase();
        const prods = allProducts.filter(p => p.tags?.includes(decodedCategory));
        setFilteredProducts(prods);
      } catch (error) {
          console.error("Failed to fetch products for category:", error);
      } finally {
          setLoading(false);
      }
    };

    fetchProducts();
  }, [category, userProfile, profileLoading]);
  
  const formattedCategory = category ? decodeURIComponent(category).replace(/-/g, ' ') : '';

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 font-headline capitalize">{formattedCategory}</h1>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold">No products found</h2>
              <p className="text-muted-foreground">There are no products in the "{formattedCategory}" category yet.</p>
              <Button asChild className="mt-6">
                  <Link href="/products">View All Products</Link>
              </Button>
            </div>
          )}
      </div>
    </AppLayout>
  );
}
