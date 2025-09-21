'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading, userProfile, profileLoading, rawIsAdmin, hasSelectedRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // This is the crucial part of the fix.
  // The wrapper NO LONGER shows a loading spinner that blocks the entire page.
  // It renders the children immediately. The useEffect below will handle redirects
  // for authenticated users *after* the page has already started rendering.

  useEffect(() => {
    // Wait until initial auth and profile loading is complete before doing anything.
    if (loading || profileLoading) {
      return;
    }

    // Only perform redirects if a user is logged in.
    if (user) {
      let redirectPath: string | null = null;
      
      const isAuthPage = pathname.startsWith('/auth');
      
      // Redirect new users to the welcome page to complete their profile.
      if (userProfile && !userProfile.isComplete && pathname !== '/auth/welcome') {
        redirectPath = '/auth/welcome';
      }
      // Redirect admins who haven't selected a role to the role selection page.
      else if (rawIsAdmin && !hasSelectedRole && pathname !== '/auth/select-role') {
        redirectPath = '/auth/select-role';
      }
      
      // If a redirect is needed, perform it.
      if (redirectPath) {
        router.push(redirectPath);
      }
    }
  }, [user, loading, userProfile, profileLoading, rawIsAdmin, hasSelectedRole, router, pathname]);

  // Render the page content immediately. Logged-in users might see a brief flash
  // of a page before being redirected, but the site will never be stuck on a
  // loading screen for everyone.
  return <>{children}</>;
}
