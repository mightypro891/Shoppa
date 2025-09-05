
'use client';

import AppLayout from "@/app/(app)/layout";
import OrderManagement from '@/components/admin/OrderManagement';

export default function AdminOrdersPage() {
  return (
    <AppLayout>
      <OrderManagement />
    </AppLayout>
  );
}
