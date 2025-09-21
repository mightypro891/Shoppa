
'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading, userProfile, rawIsAdmin, hasSelectedRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  // Exclude auth pages from this logic to avoid redirect loops
  const isAuthPage = pathname.startsWith('/auth');

  useEffect(() => {
    // We only need to run checks if a user is logged in and not on an auth page.
    if (loading || !user || isAuthPage) {
      setIsChecking(false);
      return;
    }
    
    // At this point, `loading` is false, and `user` is present.
    // We need to wait for `userProfile` to be determined.
    if (userProfile === undefined) {
        // userProfile is still loading, keep showing the loader
        setIsChecking(true);
        return;
    }

    let redirectPath: string | null = null;
    
    // The user exists, now check their state
    if (rawIsAdmin && !hasSelectedRole) {
        redirectPath = '/auth/select-role';
    } else if (userProfile && !userProfile.isComplete) {
        redirectPath = '/auth/welcome';
    }
    
    if (redirectPath && pathname !== redirectPath) {
        router.push(redirectPath);
    } else {
        // If no redirect is needed, we are done checking.
        setIsChecking(false);
    }
  }, [user, loading, userProfile, rawIsAdmin, hasSelectedRole, router, pathname, isAuthPage]);

  // The loader should only show for authenticated users during their initial checks.
  // It will not block rendering for anonymous users.
  if (isChecking && !isAuthPage) {
     return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
