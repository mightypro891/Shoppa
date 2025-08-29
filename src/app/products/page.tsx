
import { getProducts } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'All Products - Lautech Shoppa',
    description: 'Browse all available Nigerian foodstuffs.',
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 font-headline">All Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {products.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))}
        </div>
    </div>
  );
}
