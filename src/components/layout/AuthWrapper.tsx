'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading, userProfile, profileLoading, rawIsAdmin, hasSelectedRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  const isAuthPage = pathname.startsWith('/auth');

  useEffect(() => {
    // Wait until initial auth and profile loading is complete
    if (loading || profileLoading) {
      setIsChecking(true);
      return;
    }
    
    // If we are on an auth page already, let it render.
    if (isAuthPage) {
        setIsChecking(false);
        return;
    }

    // If a user is logged in, check if they need to be redirected.
    if (user) {
        let redirectPath: string | null = null;
        
        // If they are an admin but haven't chosen a role for this session
        if (rawIsAdmin && !hasSelectedRole) {
            redirectPath = '/auth/select-role';
        } 
        // If their profile is incomplete (e.g., new user)
        else if (userProfile && !userProfile.isComplete) {
            redirectPath = '/auth/welcome';
        }
        
        // If a redirect is needed and we aren't already there, redirect.
        if (redirectPath && pathname !== redirectPath) {
            router.push(redirectPath);
            // Keep showing the loader while redirecting
            setIsChecking(true); 
        } else {
            // No redirect needed, show the content.
            setIsChecking(false);
        }
    } else {
        // No user, not loading, so just show the content.
        setIsChecking(false);
    }
  }, [user, loading, userProfile, profileLoading, rawIsAdmin, hasSelectedRole, router, pathname, isAuthPage]);

  if (isChecking) {
     return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
