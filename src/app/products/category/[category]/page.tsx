
import { getProducts } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: { category: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = decodeURIComponent(params.category);
  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} - Lautech Shoppa`,
    description: `Browse products in the ${category} category.`,
  }
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params;
  const products = await getProducts();

  const filteredProducts = products.filter(p => p.tags?.includes(decodeURIComponent(category).toLowerCase()));

  if (filteredProducts.length === 0) {
    // Or you could show a "No products found" message
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 font-headline capitalize">{decodeURIComponent(category)}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))}
        </div>
    </div>
  );
}

export async function generateStaticParams() {
  const products = await getProducts();
  const tags = new Set(products.flatMap(p => p.tags || []));
  
  return Array.from(tags).map(tag => ({
    category: tag
  }))
}
