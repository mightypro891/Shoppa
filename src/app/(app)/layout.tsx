
'use client';

import { useAuth } from '@/context/AuthContext';
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import SupportChatWidget from "@/components/layout/SupportChatWidget";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profileLoading, userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!profileLoading && user && !userProfile?.isComplete) {
      router.push('/auth/welcome');
    }
  }, [user, profileLoading, userProfile, router]);
  
  if (profileLoading && user) {
     return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
     )
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <SupportChatWidget />
      <Footer />
    </>
  )
}
