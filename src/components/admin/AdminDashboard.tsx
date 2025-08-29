
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ShieldAlert, Package, Star, Megaphone, ShoppingCart, Users, Trash2, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ProductPieChart from './charts/ProductPieChart';
import ProductBarChart from './charts/ProductBarChart';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';

export default function AdminDashboard() {
  const { isAdmin, isSuperAdmin, loading, admins, addAdmin, removeAdmin } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [newAdminEmail, setNewAdminEmail] = useState('');

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/auth/signin');
    }
  }, [isAdmin, loading, router]);

  const handleAddAdmin = () => {
    if (newAdminEmail && /\S+@\S+\.\S+/.test(newAdminEmail)) {
        addAdmin(newAdminEmail);
        toast({ title: 'Admin Added', description: `${newAdminEmail} is now an admin.` });
        setNewAdminEmail('');
    } else {
        toast({ title: 'Invalid Email', description: 'Please enter a valid email address.', variant: 'destructive' });
    }
  };

  const handleRemoveAdmin = (email: string) => {
      removeAdmin(email);
      toast({ title: 'Admin Removed', description: `${email} is no longer an admin.`, variant: 'destructive'});
  };

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (!isAdmin) {
    return (
        <div className="container mx-auto py-12 md:py-24 flex justify-center">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <ShieldAlert className="mx-auto h-16 w-16 text-destructive" />
                    <CardTitle className="text-2xl">Access Denied</CardTitle>
                    <CardDescription>
                        You do not have permission to view this page. Please sign in with an admin account.
                    </CardDescription>
                </CardHeader>
            </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Store Analytics</CardTitle>
                    <CardDescription>An overview of your store's performance.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="sold">
                        <TabsList className="mb-4">
                            <TabsTrigger value="sold">Products Sold</TabsTrigger>
                            <TabsTrigger value="refunds">Refunds</TabsTrigger>
                            <TabsTrigger value="views">Product Views</TabsTrigger>
                            <TabsTrigger value="delivered">Delivered</TabsTrigger>
                        </TabsList>
                        <TabsContent value="sold">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <ProductPieChart />
                                <ProductBarChart />
                            </div>
                        </TabsContent>
                        <TabsContent value="refunds">
                            <div className="text-center py-10 text-muted-foreground">
                                Refund analytics are not yet available.
                            </div>
                        </TabsContent>
                        <TabsContent value="views">
                            <div className="text-center py-10 text-muted-foreground">
                                Product view analytics are not yet available.
                            </div>
                        </TabsContent>
                        <TabsContent value="delivered">
                            <div className="text-center py-10 text-muted-foreground">
                                Delivery analytics are not yet available.
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
        
        {isSuperAdmin && (
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5" /> Admin Management</CardTitle>
                        <CardDescription>Add or remove admin users.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input 
                                type="email"
                                placeholder="new.admin@example.com"
                                value={newAdminEmail}
                                onChange={(e) => setNewAdminEmail(e.target.value)}
                            />
                            <Button onClick={handleAddAdmin} size="icon">
                                <PlusCircle className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Current Admins</h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {admins.map(email => (
                                    <div key={email} className="flex items-center justify-between p-2 rounded-md bg-secondary">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm truncate">{email}</span>
                                            {email === 'promiseoyedele07@gmail.com' && <Badge>Super</Badge>}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-destructive hover:text-destructive"
                                            onClick={() => handleRemoveAdmin(email)}
                                            disabled={email === 'promiseoyedele07@gmail.com'}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )}

       </div>


       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Product Management
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription>
              Add, edit, and manage your products.
            </CardDescription>
             <Button asChild className="mt-4">
                <Link href="/admin/products">Go to Products</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Order Management
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription>
              View and update customer orders.
            </CardDescription>
             <Button asChild className="mt-4">
                <Link href="/admin/orders">Go to Orders</Link>
            </Button>
          </CardContent>
        </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Review Management
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription>
                Approve and manage customer reviews.
            </CardDescription>
             <Button variant="secondary" disabled className="mt-4">
                Post Reviews
            </Button>
             <Button variant="destructive" disabled className="mt-4 ml-2">
                Delete Review
            </Button>
          </CardContent>
        </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Promotions
            </CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription>
                Create and manage sales promotions.
            </CardDescription>
             <Button variant="secondary" disabled className="mt-4">
                Coming Soon
            </Button>
          </CardContent>
        </Card>
       </div>
    </div>
  );
}
