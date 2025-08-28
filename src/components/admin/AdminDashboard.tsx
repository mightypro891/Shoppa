
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ShieldAlert, Package } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/auth/signin');
    }
  }, [isAdmin, loading, router]);

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
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>More admin features will be added here, like review and promotion management.</CardDescription>
          </CardHeader>
          <CardContent>
          </CardContent>
        </Card>
       </div>
    </div>
  );
}
