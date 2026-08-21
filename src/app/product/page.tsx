import { Suspense } from 'react';
import ProductClientPage from '@/components/ProductClientPage';

// This page reads the product id from the URL search params and fetches
// data client-side, so it can't be meaningfully prerendered at build time.
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProductClientPage />
    </Suspense>
  );
}
