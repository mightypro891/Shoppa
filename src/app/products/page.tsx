
'use client';

import { getProducts } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';


export default function ProductsPage() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const prods = await getProducts();
      setProducts(prods);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = searchTerm
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : products;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 font-headline">
          {searchTerm ? `Search results for "${searchTerm}"` : "All Products"}
        </h1>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="mx-auto h-24 w-24 text-muted-foreground" />
            <h2 className="mt-4 text-2xl font-semibold">No products found</h2>
            <p className="mt-2 text-muted-foreground">We couldn't find any products matching your search.</p>
            <Button asChild className="mt-6">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        )}
    </div>
  );
}
