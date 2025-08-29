
import OrderManagement from '@/components/admin/OrderManagement';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Management - Lautech Shoppa',
  description: 'Manage customer orders.',
};

export default function AdminOrdersPage() {
  return <OrderManagement />;
}
