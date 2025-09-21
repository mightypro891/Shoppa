
'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading, userProfile, profileLoading, rawIsAdmin, hasSelectedRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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
  
   // While waiting for user data, show a loader only on protected pages or setup pages
   if ((loading || profileLoading) && user) {
     const isSetupPage = pathname.startsWith('/auth/welcome') || pathname.startsWith('/auth/select-role');
     if (!isSetupPage) {
        return (
          <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        );
     }
   }

  // Render the page content immediately for public users or once checks are complete for logged-in users.
  return <>{children}</>;
}
