
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const profileSchema = z.object({
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  address: z.string().min(10, 'Please enter a full street address.'),
  city: z.string().min(2, 'Please enter your city.'),
  campus: z.enum(['Ogbomoso', 'Iseyin'], { required_error: 'Please select your campus.' }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function WelcomeForm() {
  const { user, loading, userProfile, saveUserProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phone: '',
      address: '',
      city: 'Ogbomoso',
      campus: 'Ogbomoso',
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      await saveUserProfile({
        phone: data.phone,
        address: data.address,
        city: data.city,
        campus: data.campus,
      });

      toast({
        title: 'Profile Complete!',
        description: "You're all set. Welcome to Lautech Shoppa!",
      });
      router.push('/');
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: 'Update Failed',
        description: 'Could not save your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome, {user.displayName}!</CardTitle>
        <CardDescription>Let's get your delivery details set up so you can start shopping.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
              control={form.control}
              name="campus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campus Location</FormLabel>
                  <Select onValueChange={(value: 'Ogbomoso' | 'Iseyin') => {
                    field.onChange(value);
                    form.setValue('city', value); // Also update city for convenience
                  }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your campus" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Ogbomoso">Ogbomoso</SelectItem>
                      <SelectItem value="Iseyin">Iseyin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>This will show you products available at your location.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 08012345678" {...field} />
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
                  <FormLabel>Street Address & Hostel Name</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. Room 1, Peace Hostel, Under G" {...field} />
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
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save and Continue
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
