
'use client';

import { useEffect, useState } from 'react';
import { getOrderById } from '@/lib/orders';
import type { Order } from '@/lib/types';
import OrderStatusTracker from './OrderStatusTracker';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';
import { Card, CardContent } from '../ui/card';

interface OrderDetailsClientProps {
  orderId: string;
}

export default function OrderDetailsClient({ orderId }: OrderDetailsClientProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      // Fetch initial order details
      const fetchedOrder = await getOrderById(orderId);
      if (fetchedOrder) {
        setOrder(fetchedOrder);
      }
      setLoading(false);
    };

    fetchOrder();

    // Poll for status updates every 5 seconds
    const interval = setInterval(async () => {
       const updatedOrder = await getOrderById(orderId);
       if (updatedOrder) {
           setOrder(updatedOrder);
       }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-12 w-full" />
        </div>
    );
  }

  if (!order) {
    return <p className="text-center text-destructive">Order not found.</p>;
  }

  return (
    <div className="space-y-6">
        <Card>
            <CardContent className="p-4 space-y-4">
                 {order.cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                          <Image src={item.image} alt={item.name} data-ai-hint={item.aiHint} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">₦{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
                    <p>Total</p>
                    <p>₦{order.cartTotal.toFixed(2)}</p>
                </div>
            </CardContent>
        </Card>
        <OrderStatusTracker currentStatus={order.status} />
    </div>
  );
}
