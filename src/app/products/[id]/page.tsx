
import { getProductById, getProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductById(params.id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - Lautech Shoppa`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductById(params.id);
  const allProducts = await getProducts();

  if (!product) {
    notFound();
  }

  const relatedProducts = allProducts
    .filter(p => p.tags?.some(tag => product.tags?.includes(tag)) && p.id !== product.id)
    .slice(0, 4);

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
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
            </div>
            <span className="text-muted-foreground text-sm">(12 reviews)</span>
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
         <Card className="max-w-2xl mx-auto">
           <CardHeader>
             <CardTitle>Leave a Review</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="space-y-4">
               <Textarea placeholder="Share your thoughts on this product..." />
               <Button disabled>Submit Review (Coming Soon)</Button>
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

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map(product => ({
    id: product.id,
  }));
}
