
'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { sendOrderConfirmationAction } from '@/app/actions';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Loader2, Wallet } from 'lucide-react';
import { createOrder } from '@/lib/orders';
import { Textarea } from '../ui/textarea';
import Link from 'next/link';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number seems too short'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  city: z.string().min(2, 'City is required'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutForm() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, userProfile, accountBalance, payWithWallet } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      city: '',
    },
  });

  useEffect(() => {
    if (user || userProfile) {
      form.reset({
        name: user?.displayName || '',
        phone: userProfile?.phone || '',
        address: userProfile?.address || '',
        city: userProfile?.city || '',
      });
    }
  }, [user, userProfile, form]);

  const handleOrderPlacement = async (data: CheckoutFormValues) => {
     if (!user || !user.email) {
      toast({
        title: 'Error',
        description: 'You must be logged in to place an order.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
        const newOrder = await createOrder({
            customer: { ...data, email: user.email },
            cartItems,
            cartTotal,
        });
        
        await sendOrderConfirmationAction({
            orderId: newOrder.id,
            customer: {
                name: data.name,
                email: user.email,
            },
            cartItems: cartItems, // Pass the full cart items
            cartTotal,
        });

        toast({
            title: 'Order Placed!',
            description: 'Your order has been successfully placed. A confirmation has been sent to your email.',
        });
        
        clearCart();
        router.push(`/order/${newOrder.id}`);

    } catch (error) {
        console.error("Order placement error:", error);
        toast({
            title: 'Order Failed',
            description: 'There was an issue placing your order. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  }


  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    const success = payWithWallet(cartTotal);
    if (success) {
        await handleOrderPlacement(data);
    } else {
        toast({
            title: 'Insufficient Balance',
            description: (
                <div className="flex flex-col gap-2">
                    <span>Your wallet balance is not enough to cover this order.</span>
                    <Button asChild size="sm" className="w-fit">
                        <Link href="/fund-wallet">Fund Wallet</Link>
                    </Button>
                </div>
            ),
            variant: 'destructive',
        });
        setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      <Card>
        <CardHeader>
          <CardTitle>Delivery Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <Input disabled value={user?.email || 'No email associated'} />
              </FormItem>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Your city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full mt-6" disabled={isSubmitting || cartItems.length === 0}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Wallet className="mr-2 h-5 w-5" /> Pay with Wallet (₦{cartTotal.toFixed(2)})
              </Button>
               <div className="text-center text-sm text-muted-foreground">
                Your balance: ₦{accountBalance.toFixed(2)}
               </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="relative w-16 h-16 rounded-md overflow-hidden">
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
          </div>
          <hr className="my-4" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>₦{cartTotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping</p>
              <p>Free</p>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <p>Total</p>
              <p>₦{cartTotal.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
