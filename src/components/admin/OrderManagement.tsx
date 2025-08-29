
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import type { Order, OrderStatus } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { getAllOrders, updateOrderStatus } from '@/lib/orders';
import { format, parseISO } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';

const statusColors: Record<OrderStatus, string> = {
    'Order Placed': 'bg-blue-500',
    'Preparing': 'bg-yellow-500',
    'Out for Delivery': 'bg-orange-500',
    'Delivered': 'bg-green-500',
}


export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchOrders() {
      const allOrders = await getAllOrders();
      setOrders(allOrders);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    const updatedOrder = await updateOrderStatus(orderId, status);
    if (updatedOrder) {
      setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? updatedOrder : o));
      toast({
          title: 'Order Status Updated',
          description: `Order #${orderId.substring(0, 5)} is now "${status}".`,
      });
    } else {
        toast({
            title: 'Update Failed',
            description: 'Could not update order status.',
            variant: 'destructive',
        });
    }
    setUpdatingId(null);
  };
  
  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Order Management</h1>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>A list of all customer orders.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map(order => (
                        <TableRow key={order.id}>
                            <TableCell className="font-mono text-sm">#{order.id.substring(0, 5)}</TableCell>
                            <TableCell>{format(parseISO(order.createdAt), "MMM d, yyyy")}</TableCell>
                            <TableCell>{order.customer.name}</TableCell>
                            <TableCell>${order.cartTotal.toFixed(2)}</TableCell>
                            <TableCell>
                                <Badge className={`text-white ${statusColors[order.status]}`}>{order.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" disabled={updatingId === order.id}>
                                            {updatingId === order.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                 Update Status <ChevronDown className="ml-2 h-4 w-4" />
                                                </>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {(['Order Placed', 'Preparing', 'Out for Delivery', 'Delivered'] as OrderStatus[]).map(status => (
                                            <DropdownMenuItem 
                                                key={status} 
                                                onClick={() => handleStatusChange(order.id, status)}
                                                disabled={order.status === status}
                                            >
                                                {status}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {orders.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        No orders have been placed yet.
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
