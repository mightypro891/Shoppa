'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2, Wallet } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import Link from 'next/link';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  address: z.string().min(10, 'Please enter a full address.'),
  city: z.string().min(2, 'Please enter a city.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileClientPage() {
  const { user, loading, userProfile, saveUserProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      city: '',
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
    if (user) {
      form.reset({
        name: user.displayName || '',
        phone: userProfile?.phone || '',
        address: userProfile?.address || '',
        city: userProfile?.city || '',
      });
    }
  }, [user, loading, router, form, userProfile]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!auth.currentUser) return;
    try {
      // Update Firebase Auth display name
      if (auth.currentUser.displayName !== data.name) {
        await updateProfile(auth.currentUser, {
          displayName: data.name,
        });
      }
      
      // Save other profile info to our local storage "DB"
      saveUserProfile({
          phone: data.phone,
          address: data.address,
          city: data.city,
          balance: userProfile?.balance || 0,
      });

      toast({
        title: 'Profile Updated',
        description: 'Your information has been successfully updated.',
      });
      // Refresh to ensure all components have the latest user data
      router.refresh(); 
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  if (loading || !user) {
    return (
       <div className="flex items-center justify-center p-10">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your display name and delivery details.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                <Input disabled value={user.email || 'No email associated'} />
                            </FormItem>
                             <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. +234 801 234 5678" {...field} />
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
                                        <Textarea placeholder="Your delivery address" {...field} />
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
                                    <FormLabel>City / Town</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Ogbomoso" {...field} />
                                    </FormControl>
                                     <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end">
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-1 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>My Wallet</CardTitle>
                    <CardDescription>Manage your account balance.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/fund-wallet">
                            <Wallet className="mr-2 h-4 w-4" /> Fund Wallet
                        </Link>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>Change your password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button disabled variant="secondary">Change Password (Coming Soon)</Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View your past orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button disabled variant="secondary">View Orders (Coming Soon)</Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
