
import AppLayout from '@/app/(app)/layout';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout - Lautech Shoppa',
  description: 'Enter your details to complete your order.',
};

export default function CheckoutPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 font-headline text-center">Checkout</h1>
          <CheckoutForm />
        </div>
      </div>
    </AppLayout>
  );
}
