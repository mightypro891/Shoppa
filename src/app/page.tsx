import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default async function Home() {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="https://picsum.photos/1600/900"
          alt="Nigerian food market"
          data-ai-hint="nigerian food"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 tracking-tight text-primary-foreground drop-shadow-lg">
            Authentic Nigerian Flavors, Delivered Fast
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            From Egusi to Garri, get all your essential Nigerian foodstuffs delivered to your doorstep. Perfect for students craving a taste of home.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
            <Link href="/products">
              Start Shopping
              <ShoppingCart className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section id="products" className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 font-headline">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
           <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
