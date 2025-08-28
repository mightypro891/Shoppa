
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ShieldAlert } from 'lucide-react';

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
       <Card>
        <CardHeader>
          <CardTitle>Welcome, Admin!</CardTitle>
          <CardDescription>This is your control panel. You can manage products, view orders, and more.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>More features coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
