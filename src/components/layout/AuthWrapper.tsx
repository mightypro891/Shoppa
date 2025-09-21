
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
    if (loading) {
      setIsChecking(true);
      return;
    }
    
    // Once initial auth is done, if there's no user, we can show the page.
    if (!user) {
      setIsChecking(false);
      return;
    }

    // If there is a user, we wait for their profile to load too.
    if (profileLoading) {
      setIsChecking(true);
      return;
    }

    // At this point, `loading` and `profileLoading` are false, and `user` is present.
    // We can now safely check their state.
    if (isAuthPage) {
        setIsChecking(false);
        return;
    }
    
    let redirectPath: string | null = null;
    
    if (rawIsAdmin && !hasSelectedRole) {
        redirectPath = '/auth/select-role';
    } else if (userProfile && !userProfile.isComplete) {
        redirectPath = '/auth/welcome';
    }
    
    if (redirectPath && pathname !== redirectPath) {
        router.push(redirectPath);
    } else {
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
