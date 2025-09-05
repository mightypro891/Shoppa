
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import Link from 'next/link';

const fundWalletSchema = z.object({
  amount: z.coerce.number().min(100, 'Minimum funding amount is ₦100.'),
});

type FundWalletFormValues = z.infer<typeof fundWalletSchema>;

export default function FundWalletClient() {
  const { user, loading, fundAccount, accountBalance } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FundWalletFormValues>({
    resolver: zodResolver(fundWalletSchema),
    defaultValues: {
      amount: 1000,
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin?redirect=/fund-wallet');
    }
  }, [user, loading, router]);

  const onSubmit = async (data: FundWalletFormValues) => {
    setIsSubmitting(true);
    // Simulate payment gateway processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    await fundAccount(data.amount);

    toast({
      title: 'Wallet Funded!',
      description: `₦${data.amount.toFixed(2)} has been successfully added to your wallet.`,
    });
    
    setIsSubmitting(false);
    router.push('/');
  };

  const setAmount = (value: number) => {
      form.setValue('amount', value, { shouldValidate: true });
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Add Funds</CardTitle>
            <CardDescription>
              Your current balance is{' '}
              <span className="font-bold text-primary">₦{accountBalance.toFixed(2)}</span>.
              Select an amount to add.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Select or Enter Amount</FormLabel>
                   <RadioGroup
                    onValueChange={(value) => setAmount(Number(value))}
                    defaultValue={field.value.toString()}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    {[1000, 2000, 5000, 10000].map(amount => (
                         <FormItem key={amount} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                                <RadioGroupItem value={String(amount)} id={`amount-${amount}`} />
                            </FormControl>
                            <FormLabel className="font-normal w-full cursor-pointer rounded-md border p-4 text-center hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10" htmlFor={`amount-${amount}`}>
                                ₦{amount.toLocaleString()}
                            </FormLabel>
                        </FormItem>
                    ))}
                  </RadioGroup>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Or enter a custom amount"
                      {...field}
                      onChange={(e) => {
                          field.onChange(e);
                          form.setValue('amount', e.target.valueAsNumber)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-center text-sm text-muted-foreground pt-4">
                You will be redirected to our secure payment partner to complete this transaction.
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
                <Link href="/profile">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Proceed to Pay ₦{form.watch('amount')?.toLocaleString() || 0}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
