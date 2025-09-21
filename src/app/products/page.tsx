
'use client';

import AppLayout from '@/app/(app)/layout';
import { getProducts } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';
import { Search, Loader2, Filter } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo, Suspense } from 'react';
import { Product } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

function ProductsPageComponent() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  const { userProfile, profileLoading } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('name-asc');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const allCategories = useMemo(() => {
    if (products.length === 0) return [];
    const categories = new Set<string>();
    products.forEach(p => p.tags?.forEach(tag => categories.add(tag)));
    return Array.from(categories).sort();
  }, [products]);

  useEffect(() => {
    if (profileLoading) return;
    
    const fetchProducts = async () => {
      setLoading(true);
      const prods = await getProducts(userProfile?.campus);
      setProducts(prods);
      setLoading(false);
    };
    fetchProducts();
  }, [userProfile, profileLoading]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const filteredProducts = useMemo(() => {
    let prods = [...products];

    if (searchTerm) {
      prods = prods.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategories.length > 0) {
      prods = prods.filter(p => p.tags?.some(tag => selectedCategories.includes(tag)));
    }
    
    switch (sortOption) {
      case 'price-asc':
        prods.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-desc':
        prods.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'name-asc':
        prods.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        prods.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return prods;
  }, [products, searchTerm, sortOption, selectedCategories]);


  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const formatCategoryName = (slug: string) => slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const FilterControls = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      <div className="space-y-2">
        {allCategories.map(category => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox 
              id={`filter-${category}`}
              checked={selectedCategories.includes(category)}
              onCheckedChange={() => handleCategoryChange(category)}
            />
            <Label htmlFor={`filter-${category}`} className="font-normal capitalize cursor-pointer">
              {formatCategoryName(category)}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold font-headline">
            {searchTerm ? `Search results for "${searchTerm}"` : "All Products"}
          </h1>
          <div className="flex items-center gap-4">
              <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="name-asc">Name: A to Z</SelectItem>
                      <SelectItem value="name-desc">Name: Z to A</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  </SelectContent>
              </Select>
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                      <span className="sr-only">Filters</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="py-4">
                      <FilterControls />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="hidden md:block md:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Filter className="mr-2 h-5 w-5"/>
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterControls />
              </CardContent>
            </Card>
          </aside>
          <main className="md:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Search className="mx-auto h-24 w-24 text-muted-foreground" />
                <h2 className="mt-4 text-2xl font-semibold">No products found</h2>
                <p className="mt-2 text-muted-foreground">We couldn't find any products matching your criteria.</p>
                <Button asChild className="mt-6">
                  <Link href="/products">View All Products</Link>
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </AppLayout>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <AppLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      </AppLayout>
    }>
      <ProductsPageComponent />
    </Suspense>
  )
}
