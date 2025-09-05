
'use client';

import { getProductById, getProducts } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewList from '@/components/reviews/ReviewList';
import { getReviewsForProduct } from '@/lib/reviews';
import ProductStoryGenerator from '@/components/products/ProductStoryGenerator';
import { useEffect, useState } from 'react';
import type { Product, Review } from '@/lib/types';
import { Star, Loader2 } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';


export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProductData = async () => {
      setLoading(true);
      
      const productData = await getProductById(id);
      if (!productData) {
        notFound();
      }
      setProduct(productData);
      
      const reviewData = await getReviewsForProduct(id);
      setReviews(reviewData);
      
      const allProducts = await getProducts();
      const related = allProducts
        .filter(p => p.tags?.some(tag => productData.tags?.includes(tag)) && p.id !== productData.id)
        .slice(0, 4);
      setRelatedProducts(related);
      
      setLoading(false);
    };

    fetchProductData();
  }, [id]);

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
    
  const averageRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square rounded-lg overflow-hidden border">
           <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint={product.aiHint}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-primary text-primary' : 'text-gray-300'}`} />
                ))}
            </div>
            <span className="text-muted-foreground text-sm">({reviews.length} reviews)</span>
          </div>
          <p className="text-muted-foreground text-lg mb-6">{product.description}</p>
          
          <div className="text-4xl font-bold text-primary mb-6">
            ₦{product.price.toFixed(2)}
          </div>

          <div className="flex items-center gap-4">
             <AddToCartButton product={product} />
          </div>
        </div>
      </div>

       <div className="mt-16 md:mt-24">
         <ProductStoryGenerator productName={product.name} productDescription={product.description} />
      </div>


       <div className="mt-16 md:mt-24">
         <Card className="max-w-3xl mx-auto">
           <CardHeader>
             <CardTitle>Customer Reviews</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="space-y-8">
                <ReviewList reviews={reviews} />
                <ReviewForm productId={product.id} />
             </div>
           </CardContent>
         </Card>
      </div>


      {relatedProducts.length > 0 && (
        <div className="mt-16 md:mt-24">
          <h2 className="text-3xl font-bold text-center mb-10 font-headline">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
