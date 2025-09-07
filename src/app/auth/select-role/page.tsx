
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, User } from 'lucide-react';

export default function SelectRolePage() {
  const { user, loading, rawIsAdmin, selectRole, logOut } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // If not loading and there's no user, or the user is not an admin, redirect.
    if (!loading && (!user || !rawIsAdmin)) {
      router.push('/auth/signin');
    }
  }, [user, loading, rawIsAdmin, router]);

  const handleRoleSelection = async (role: 'admin' | 'user') => {
    setIsProcessing(true);
    await selectRole(role);
    // The state update needs a moment to propagate.
    // The redirection will now be handled by the AppLayout's useEffect.
    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  };
  
  const handleLogOut = async () => {
    await logOut();
    router.push('/auth/signin');
  }

  // Show loader while auth is resolving or if user is not available yet
  if (loading || !user || isProcessing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center py-12 md:py-24">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Select Your Role</CardTitle>
          <CardDescription>
            How would you like to proceed, {user.displayName}?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            size="lg"
            className="w-full"
            onClick={() => handleRoleSelection('admin')}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Shield className="mr-2 h-5 w-5" />}
            Proceed as Admin
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => handleRoleSelection('user')}
            disabled={isProcessing}
          >
             {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <User className="mr-2 h-5 w-5" />}
            Continue as a Customer
          </Button>
          <div className="pt-4">
            <Button
                variant="link"
                size="sm"
                className="text-muted-foreground"
                onClick={handleLogOut}
            >
                Not you? Log out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
