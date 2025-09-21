
'use client';

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import SupportChatWidget from "@/components/layout/SupportChatWidget";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";


export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, profileLoading, rawIsAdmin, hasSelectedRole, userProfile } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Wait until both auth and profile are loaded before doing any redirects
    if (loading || profileLoading) {
      return;
    }

    let redirectPath: string | null = null;
    
    if (user) {
        if (rawIsAdmin && !hasSelectedRole) {
            redirectPath = '/auth/select-role';
        } else if (userProfile && !userProfile.isComplete) {
            redirectPath = '/auth/welcome';
        }
    }
    
    if (redirectPath) {
        setIsRedirecting(true);
        router.push(redirectPath);
    } else {
        setIsRedirecting(false);
    }

  }, [user, loading, profileLoading, rawIsAdmin, hasSelectedRole, userProfile, router]);
  
  // The loader should be shown if auth or profile are loading, or if a redirect is in progress.
  const showLoader = loading || profileLoading || isRedirecting;

  if (showLoader) {
     return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
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
