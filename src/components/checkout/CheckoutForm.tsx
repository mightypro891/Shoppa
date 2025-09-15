
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
import { Loader2, Wallet, Package, Bike } from 'lucide-react';
import { createOrder } from '@/lib/orders';
import { Textarea } from '../ui/textarea';
import Link from 'next/link';
import type { DeliveryMethod, DeliveryRoute } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { getDeliveryRoutes } from '@/lib/locations';


const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number seems too short'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  city: z.string().min(2, 'City is required'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutForm() {
  const { cartItems, subTotal, clearCart } = useCart();
  const { user, userProfile, accountBalance, payWithWallet } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [deliveryRoutes, setDeliveryRoutes] = useState<DeliveryRoute[]>([]);
  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    const fetchRoutes = async () => {
        const routes = await getDeliveryRoutes();
        setDeliveryRoutes(routes);
    };
    fetchRoutes();
  }, []);

  useEffect(() => {
    if (deliveryMethod === 'pickup' || !userProfile || cartItems.length === 0) {
        setDeliveryFee(0);
        return;
    }

    const cartCampuses = new Set(cartItems.map(item => item.campus));
    const userCampus = userProfile.campus;
    let fee = 0;

    // Check if a delivery to a different campus is required
    const needsInterCampusDelivery = Array.from(cartCampuses).some(cc => cc !== userCampus);

    if (needsInterCampusDelivery) {
        const otherCampus = userCampus === 'Ogbomoso' ? 'Iseyin' : 'Ogbomoso';
        const route = deliveryRoutes.find(r => (r.from === otherCampus && r.to === userCampus) || (r.from === userCampus && r.to === otherCampus));
        fee = route?.price || 0; // Use route price, or 0 if not found
    } else {
        // All items are from the same campus as the user
        const route = deliveryRoutes.find(r => r.from === userCampus && r.to === userCampus);
        fee = route?.price || 0;
    }

    setDeliveryFee(fee);

  }, [deliveryMethod, cartItems, userProfile, deliveryRoutes]);


  const total = subTotal + deliveryFee;

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
            subTotal,
            deliveryFee,
            total,
            deliveryMethod,
        });
        
        await sendOrderConfirmationAction({
            orderId: newOrder.id,
            customer: {
                name: data.name,
                email: user.email,
            },
            cartItems: cartItems, // Pass the full cart items
            subTotal,
            deliveryFee,
            total,
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
    if (accountBalance < total) {
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
        return;
    }

    const success = payWithWallet(total);
    if (success) {
        await handleOrderPlacement(data);
    } else {
        // This case should be rare due to the check above, but it's good practice
        toast({ title: "Payment failed", description: "Could not process wallet payment.", variant: "destructive" });
        setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Delivery Method</CardTitle>
            </CardHeader>
            <CardContent>
                <RadioGroup value={deliveryMethod} onValueChange={(value: DeliveryMethod) => setDeliveryMethod(value)} className="grid grid-cols-2 gap-4">
                     <Label htmlFor="delivery" className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", deliveryMethod === 'delivery' && "border-primary")}>
                         <RadioGroupItem value="delivery" id="delivery" className="sr-only" />
                        <Bike className="mb-3 h-6 w-6" />
                        Delivery
                    </Label>
                    <Label htmlFor="pickup" className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", deliveryMethod === 'pickup' && "border-primary")}>
                         <RadioGroupItem value="pickup" id="pickup" className="sr-only" />
                        <Package className="mb-3 h-6 w-6" />
                        Pickup
                    </Label>
                </RadioGroup>
                {deliveryMethod === 'pickup' && (
                    <p className="text-sm text-muted-foreground mt-4 text-center">You will be notified when your order is ready for pickup at the campus vendor location.</p>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                {deliveryMethod === 'delivery' && (
                    <>
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
                    </>
                )}
                </form>
            </Form>
            </CardContent>
        </Card>
      </div>
      
      <Card className="sticky top-24 self-start">
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
                <p className="font-semibold">₦{((item.salePrice || item.price) * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <hr className="my-4" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>₦{subTotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>Delivery Fee</p>
              <p>{deliveryFee > 0 ? `₦${deliveryFee.toFixed(2)}` : 'Free'}</p>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <p>Total</p>
              <p>₦{total.toFixed(2)}</p>
            </div>
          </div>
            <Button type="submit" form="checkout-form" size="lg" className="w-full mt-6" disabled={isSubmitting || cartItems.length === 0}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Wallet className="mr-2 h-5 w-5" /> Pay with Wallet (₦{total.toFixed(2)})
            </Button>
            <div className="text-center text-sm text-muted-foreground mt-2">
                Your balance: ₦{accountBalance.toFixed(2)}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

    