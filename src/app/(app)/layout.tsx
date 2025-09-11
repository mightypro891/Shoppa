
'use client';

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import SupportChatWidget from "@/components/layout/SupportChatWidget";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";


export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, rawIsAdmin, hasSelectedRole, userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for auth state to resolve

    // Redirect admin to role selection if they haven't chosen one
    if (user && rawIsAdmin && !hasSelectedRole) {
      router.push('/auth/select-role');
      return;
    }
    
    // Redirect new users to the welcome form if their profile is incomplete
    if (user && !rawIsAdmin && userProfile && !userProfile.isComplete) {
      router.push('/auth/welcome');
      return;
    }

  }, [user, loading, rawIsAdmin, hasSelectedRole, userProfile, router]);

  // Show a loader while auth state is resolving OR for redirects.
  if (loading || (user && rawIs-Admin && !hasSelectedRole) || (user && !rawIsAdmin && userProfile && !userProfile.isComplete)) {
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
