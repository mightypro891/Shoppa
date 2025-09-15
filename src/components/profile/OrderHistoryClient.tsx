
'use client';

import { useAuth } from '@/context/AuthContext';
import { getOrdersByUserId } from '@/lib/orders';
import type { Order, OrderStatus } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Loader2, Package, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const statusColors: Record<OrderStatus, string> = {
    'Order Placed': 'bg-blue-500',
    'Preparing': 'bg-yellow-500',
    'Out for Delivery': 'bg-orange-500',
    'Delivered': 'bg-green-500',
    'Ready for Pickup': 'bg-purple-500',
};

export default function OrderHistoryClient() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin?redirect=/profile/orders');
      return;
    }

    if (user) {
      const fetchOrders = async () => {
        setLoading(true);
        const userOrders = await getOrdersByUserId(user.uid);
        setOrders(userOrders);
        setLoading(false);
      };
      fetchOrders();
    }
  }, [user, authLoading, router]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
       <div className="text-center py-20">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-semibold">No Orders Yet</h2>
        <p className="mt-2 text-muted-foreground">You haven't placed any orders with us.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Past Orders</CardTitle>
        <CardDescription>A list of all your previous purchases.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">#{order.id.substring(0, 7)}</TableCell>
                <TableCell>{format(new Date(order.createdAt), 'MMM d, yyyy')}</TableCell>
                <TableCell>₦{order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={`text-white ${statusColors[order.status]}`}>{order.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/order/${order.id}`}>View Details</Link>
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
