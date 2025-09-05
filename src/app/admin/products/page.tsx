
'use client';

import AppLayout from '@/app/(app)/layout';
import ProductManagement from '@/components/admin/ProductManagement';

export default function AdminProductsPage() {
  return (
    <AppLayout>
      <ProductManagement />
    </AppLayout>
  );
}
