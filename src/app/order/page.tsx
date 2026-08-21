
import { Suspense } from 'react';
import OrderDetailsClient from '@/components/order/OrderDetailsClient';

// Reads the order id from the URL search params and fetches data
// client-side, so it can't be meaningfully prerendered at build time.
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <OrderDetailsClient />
    </Suspense>
  );
}
