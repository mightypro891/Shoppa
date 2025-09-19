
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';
import { Loader2, Zap, Truck, ShieldCheck, Leaf, Star } from 'lucide-react';
import type { Product, Review } from '@/lib/types';
import HeroButton from '@/components/layout/HeroButton';
import { useEffect, useState } from 'react';
import Countdown from '@/components/ui/countdown';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAllReviews } from '@/lib/reviews';
import { useAuth } from '@/context/AuthContext';
import { mainCategories } from '@/lib/categories';

export default function Home() {
  const { userProfile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userProfile && userProfile !== null) return; // Wait for profile to be loaded or confirmed null
      
      setLoading(true);
      try {
        // Pass user's campus to get filtered products, or undefined if no user
        const prods = await getProducts(userProfile?.campus);
        const allReviews = await getAllReviews();
        setProducts(prods);
        setReviews(allReviews.slice(0, 4)); // Get latest 4 reviews
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [userProfile]);
  
  const categories = mainCategories.map(c => c.slug);

  const productsByCategory: { [key: string]: Product[] } = {};

  categories.forEach(category => {
    productsByCategory[category] = products.filter(p => p.tags?.includes(category));
  });

  const saleProducts = products.filter(p => p.salePrice).slice(0, 4);
  const featuredProducts = products.slice(5, 12);

  const getSaleEndDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + (7 - d.getDay() + 1) % 7); // Next Sunday
    d.setHours(23, 59, 59, 999);
    return d.toISOString();
  }

  // Helper to format category names for display
  const formatCategoryName = (slug: string) => {
    const category = mainCategories.find(c => c.slug === slug);
    return category ? category.name : slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="https://picsum.photos/seed/1/1600/900"
          alt="Online campus shopping"
          data-ai-hint="online shopping"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 tracking-tight text-white drop-shadow-lg">
            Your One-Stop Campus Shop
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-neutral-200">
            From foodstuffs to gadgets, get everything you need at <span className="font-bold text-primary">{userProfile?.campus || 'your campus'}</span>, delivered to your doorstep.
          </p>
          <HeroButton />
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      ) : (
        <>

          {/* Featured Products Carousel */}
          {featuredProducts.length > 0 && (
            <section id="featured" className="py-12 md:py-16 bg-background">
              <div className="container mx-auto px-4">
                 <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-10">Featured Products</h2>
                 <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                 >
                    <CarouselContent>
                        {featuredProducts.map(product => (
                            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                <div className="p-1">
                                    <ProductCard product={product} />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                 </Carousel>
              </div>
            </section>
          )}

          {saleProducts.length > 0 && (
            <section id="deals" className="py-12 md:py-16 bg-amber-50 dark:bg-amber-950/20">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                  <div className='text-center md:text-left'>
                    <h2 className="text-3xl md:text-4xl font-bold font-headline capitalize text-amber-600 dark:text-amber-400 flex items-center gap-2">
                       <Zap className="h-8 w-8"/> Today's Deals
                    </h2>
                    <p className="text-muted-foreground">Don't miss out on these amazing prices!</p>
                  </div>
                  <div className="bg-white dark:bg-card p-4 rounded-lg shadow-md">
                    <Countdown targetDate={getSaleEndDate()} />
                  </div>
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {saleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          )}
          
            {/* Customer Testimonials Section */}
          {reviews.length > 0 && (
              <section className="py-12 md:py-16 bg-secondary/30">
                  <div className="container mx-auto px-4">
                      <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-10">What Our Customers Say</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {reviews.map(review => (
                              <Card key={review.id} className="p-6 flex flex-col">
                                  <div className="flex items-center mb-4">
                                      <Avatar className="h-12 w-12 mr-4">
                                          <AvatarImage src={review.authorImage || ''} alt={review.authorName} />
                                          <AvatarFallback>{review.authorName.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                          <p className="font-semibold">{review.authorName}</p>
                                          <div className="flex items-center">
                                              {[...Array(5)].map((_, i) => (
                                                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                              ))}
                                          </div>
                                      </div>
                                  </div>
                                  <CardContent className="p-0">
                                      <p className="text-muted-foreground text-sm italic">"{review.text}"</p>
                                  </CardContent>
                              </Card>
                          ))}
                      </div>
                  </div>
              </section>
          )}


          {categories.map(category => (
            productsByCategory[category]?.length > 0 && (
              <section key={category} id={category} className="py-12 md:py-16 bg-background even:bg-secondary/20">
                <div className="container mx-auto px-4">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline capitalize">
                      {formatCategoryName(category)}
                    </h2>
                    <Button asChild variant="outline">
                      <Link href={`/products/category/${category}`}>View All</Link>
                    </Button>
                  </div>
                    <Carousel
                        opts={{
                            align: "start",
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {productsByCategory[category].map((product) => (
                                <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                    <div className="p-1">
                                        <ProductCard product={product} />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex" />
                        <CarouselNext className="hidden md:flex" />
                    </Carousel>
                </div>
              </section>
            )
          ))}
        </>
      )}
    </div>
  );
}
