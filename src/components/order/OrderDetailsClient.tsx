
'use client';

import { useEffect, useState } from 'react';
import { getOrderById } from '@/lib/orders';
import type { Order } from '@/lib/types';
import OrderStatusTracker from './OrderStatusTracker';
import { Skeleton } from '../ui/skeleton';

interface OrderDetailsClientProps {
  orderId: string;
}

export default function OrderDetailsClient({ orderId }: OrderDetailsClientProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const fetchedOrder = await getOrderById(orderId);
      if (fetchedOrder) {
        setOrder(fetchedOrder);
      }
      setLoading(false);
    };

    fetchOrder();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchOrder, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return <Skeleton className="h-24 w-full" />;
  }

  if (!order) {
    return <p className="text-center text-destructive">Order not found.</p>;
  }

  return <OrderStatusTracker currentStatus={order.status} />;
}
