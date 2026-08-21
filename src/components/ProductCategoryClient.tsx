"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AppLayout from '@/app/(app)/layout';
import ProductCard from '@/components/products/ProductCard';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProductCategoryClient() {
  const search = useSearchParams();
  const category = search.get('category') || '';
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const allProducts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const decodedCategory = decodeURIComponent(category).toLowerCase();
        const prods = allProducts.filter((p: any) => p.tags?.includes(decodedCategory));
        setFilteredProducts(prods);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  const formattedCategory = category ? decodeURIComponent(category).replace(/-/g, ' ') : '';

  if (loading) return (
    <AppLayout>
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    </AppLayout>
  );

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
