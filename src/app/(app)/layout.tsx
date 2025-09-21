'use client';

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import SupportChatWidget from "@/components/layout/SupportChatWidget";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // All complex auth logic has been moved to AuthWrapper.
  // This layout is now only responsible for the common UI structure.

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <SupportChatWidget />
      <Footer />
    </>
  )
}
