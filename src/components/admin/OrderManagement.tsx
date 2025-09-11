
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import Image from 'next/image';

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
                <CardDescription>A list of all customer orders. Click a row to see details.</CardDescription>
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
                          <Dialog key={order.id}>
                            <DialogTrigger asChild>
                              <TableRow className="cursor-pointer">
                                <TableCell className="font-mono text-sm">#{order.id.substring(0, 5)}</TableCell>
                                <TableCell>{format(parseISO(order.createdAt), "MMM d, yyyy")}</TableCell>
                                <TableCell>{order.customer.name}</TableCell>
                                <TableCell>₦{order.total.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge className={`text-white ${statusColors[order.status]}`}>{order.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm" disabled={updatingId === order.id} onClick={(e) => e.stopPropagation()}>
                                                {updatingId === order.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <>
                                                    Update Status <ChevronDown className="ml-2 h-4 w-4" />
                                                    </>
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
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
                            </DialogTrigger>
                             <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Order Details</DialogTitle>
                                    <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4 py-4">
                                    <div>
                                        <h4 className="font-semibold">Customer Details</h4>
                                        <p>{order.customer.name}</p>
                                        <p>{order.customer.email}</p>
                                        <p>{order.customer.phone}</p>
                                    </div>
                                     <div>
                                        <h4 className="font-semibold">Delivery Address</h4>
                                        <p>{order.customer.address}</p>
                                        <p>{order.customer.city}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                     <h4 className="font-semibold">Items</h4>
                                    {order.cartItems.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-2 rounded-md bg-secondary">
                                            <div className="flex items-center gap-3">
                                                <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-md object-cover" />
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-medium">₦{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t pt-4 mt-4 space-y-2">
                                    <div className="flex justify-between"><span>Subtotal:</span> <span>₦{order.subTotal.toFixed(2)}</span></div>
                                    <div className="flex justify-between"><span>Delivery:</span> <span>₦{order.deliveryFee.toFixed(2)}</span></div>
                                    <div className="flex justify-between font-bold text-lg"><span>Total:</span> <span>₦{order.total.toFixed(2)}</span></div>
                                </div>
                            </DialogContent>
                          </Dialog>
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
