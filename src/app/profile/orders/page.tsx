
import AppLayout from '@/app/(app)/layout';
import { Metadata } from 'next';
import OrderHistoryClient from '@/components/profile/OrderHistoryClient';

export const metadata: Metadata = {
  title: 'My Orders - Lautech Shoppa',
  description: 'View your order history.',
};

export default function OrderHistoryPage() {
  return (
    <AppLayout>
      <div className="container mx-auto max-w-4xl py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 font-headline">My Orders</h1>
        <OrderHistoryClient />
      </div>
    </AppLayout>
  );
}
