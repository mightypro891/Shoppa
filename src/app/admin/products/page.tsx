
import ProductManagement from '@/components/admin/ProductManagement';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Management - Naija Shoppa',
  description: 'Manage your store products.',
};

export default function AdminProductsPage() {
  return <ProductManagement />;
}
