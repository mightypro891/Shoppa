
import { Suspense } from 'react';
import EditProductClient from '@/components/admin/EditProductClient';

// Reads the product id from the URL search params and fetches data
// client-side, so it can't be meaningfully prerendered at build time.
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <EditProductClient />
    </Suspense>
  );
}
