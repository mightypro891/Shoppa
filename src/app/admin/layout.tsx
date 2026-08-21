
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!isAdmin) {
        router.push('/auth/signin?redirect=/admin');
      } else {
        setIsChecking(false);
      }
    }
  }, [isAdmin, loading, router]);

  if (loading || isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAdmin) {
      return (
         <div className="flex h-screen items-center justify-center bg-secondary/30">
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
      )
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-secondary/20">{children}</main>
      <Footer />
    </>
  );
}
