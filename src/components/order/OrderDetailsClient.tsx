
'use client';

import { useEffect, useState } from 'react';
import { getOrderById } from '@/lib/orders';
import type { Order } from '@/lib/types';
import OrderStatusTracker from './OrderStatusTracker';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';
import { Card, CardContent } from '../ui/card';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface OrderDetailsClientProps {
  orderId: string;
}

export default function OrderDetailsClient({ orderId }: OrderDetailsClientProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    // Set up a real-time listener for the order
    const orderDocRef = doc(db, 'orders', orderId);
    
    const unsubscribe = onSnapshot(orderDocRef, (doc) => {
        if (doc.exists()) {
            setOrder({ id: doc.id, ...doc.data() } as Order);
        } else {
            console.error("No such order!");
            setOrder(null);
        }
        setLoading(false);
    }, (error) => {
        console.error("Error listening to order updates:", error);
        setLoading(false);
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
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
                    <p className="font-semibold">₦{((item.salePrice || item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <p>Subtotal</p>
                    <p>₦{order.subTotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p>Delivery Fee</p>
                    <p>₦{order.deliveryFee.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <p>Total</p>
                    <p>₦{order.total.toFixed(2)}</p>
                  </div>
                </div>
            </CardContent>
        </Card>
        <OrderStatusTracker currentStatus={order.status} />
    </div>
  );
}
