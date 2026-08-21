
import AppLayout from '@/app/(app)/layout';
import FundWalletClient from '@/components/wallet/FundWalletClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fund Wallet - Lautech Shoppa',
  description: 'Add funds to your Lautech Shoppa account wallet.',
};

export default function FundWalletPage() {
  return (
    <AppLayout>
      <div className="container mx-auto max-w-2xl py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 font-headline">Fund Your Wallet</h1>
        <FundWalletClient />
      </div>
    </AppLayout>
  );
}
