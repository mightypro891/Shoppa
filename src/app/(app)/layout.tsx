
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
  const { user, loading, rawIsAdmin, hasSelectedRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading, there's a user, they are an admin, but they haven't picked a role yet
    if (!loading && user && rawIsAdmin && !hasSelectedRole) {
      router.push('/auth/select-role');
    }
  }, [user, loading, rawIsAdmin, hasSelectedRole, router]);

  // Show a loader while auth state is resolving OR if an admin hasn't selected a role yet.
  if (loading || (user && rawIsAdmin && !hasSelectedRole)) {
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
