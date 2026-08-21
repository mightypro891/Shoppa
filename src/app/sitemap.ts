import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/data';
import { mainCategories } from '@/lib/categories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shoppa.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/auth/signin`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/auth/signup`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = mainCategories.map((category) => ({
    url: `${SITE_URL}/products/category?category=${category.slug}`,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts();
    productRoutes = products.map((product) => ({
      url: `${SITE_URL}/product?id=${product.id}`,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch (err) {
    // If Firestore isn't reachable at build time, still ship the static routes.
    console.error('Sitemap: failed to fetch products', err);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
