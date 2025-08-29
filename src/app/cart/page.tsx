
import CartClientPage from '@/components/cart/CartClientPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart - Lautech Shoppa',
  description: 'Review your items and proceed to checkout.',
};

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 font-headline">Your Shopping Cart</h1>
      <CartClientPage />
    </div>
  );
}
