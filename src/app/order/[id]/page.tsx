
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import OrderStatusTracker from "@/components/order/OrderStatusTracker";
import { CheckCircle2 } from "lucide-react";
import { Metadata } from 'next';
import { getOrderById } from "@/lib/orders";
import { notFound } from "next/navigation";
import OrderDetailsClient from "@/components/order/OrderDetailsClient";

export const metadata: Metadata = {
  title: 'Order Confirmed - Lautech Shoppa',
  description: 'Your order has been placed successfully.',
};

export default async function OrderPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <Card className="max-w-2xl mx-auto text-center">
        <CardHeader>
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
          <CardTitle className="text-3xl font-bold mt-4">Order Confirmed!</CardTitle>
          <CardDescription className="text-lg">
            Thank you for your purchase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Your Order ID is: <span className="font-mono font-semibold text-foreground">{params.id}</span>
          </p>
          
          <div className="text-left">
            <h3 className="font-semibold text-lg mb-4">Order Status</h3>
            <OrderDetailsClient orderId={params.id} />
          </div>

          <Button asChild className="mt-6">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
