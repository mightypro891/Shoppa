
'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import RecipeSuggestions from './RecipeSuggestions';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function CartClientPage() {
  const { cartItems, updateQuantity, removeFromCart, subTotal, deliveryFee, total, itemCount } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: 'Please Sign In',
        description: 'You need to be logged in to proceed to checkout.',
        variant: 'destructive',
      });
      router.push('/auth/signin?redirect=/cart');
    } else {
      router.push('/checkout');
    }
  };


  if (itemCount === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-semibold">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild className="mt-6">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      <div className="lg:col-span-2 space-y-4">
        {cartItems.map((item) => (
          <Card key={item.id} className="flex items-center p-4">
            <div className="relative w-24 h-24 rounded-md overflow-hidden mr-4">
              <Image src={item.image} alt={item.name} data-ai-hint={item.aiHint} fill className="object-cover" />
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-muted-foreground text-sm">₦{(item.salePrice || item.price).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="ml-4 text-right">
              <p className="font-semibold">₦{((item.salePrice || item.price) * item.quantity).toFixed(2)}</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-2 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
              <Trash2 className="h-5 w-5" />
            </Button>
          </Card>
        ))}
      </div>
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <p>Subtotal ({itemCount} items)</p>
              <p>₦{subTotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p>Delivery Fee</p>
              <p>{deliveryFee > 0 ? `₦${deliveryFee.toFixed(2)}` : 'Free'}</p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between font-bold text-lg mb-6">
              <p>Total</p>
              <p>₦{total.toFixed(2)}</p>
            </div>
            <Button onClick={handleCheckout} className="w-full" size="lg">
              Proceed to Checkout
            </Button>
            <RecipeSuggestions />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
