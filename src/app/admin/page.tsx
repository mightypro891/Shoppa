
import AppLayout from '@/app/(app)/layout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Lautech Shoppa',
  description: 'Manage products, orders, and customers.',
};

export default function AdminPage() {
  return (
    <AppLayout>
      <AdminDashboard />
    </AppLayout>
  );
}
