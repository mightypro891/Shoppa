
import { Suspense } from 'react';
import ProductCategoryClient from '@/components/ProductCategoryClient';

// Reads the category from the URL search params and fetches data
// client-side, so it can't be meaningfully prerendered at build time.
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <ProductCategoryClient />
    </Suspense>
  );
}
