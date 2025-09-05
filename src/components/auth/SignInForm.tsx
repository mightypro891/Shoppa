
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512S0 403.3 0 261.8C0 120.3 106.5 8 244 8s244 112.3 244 253.8zM138.3 327.4c-21.6-32-34.1-70-34.1-111.4s12.5-79.4 34.1-111.4h1.2c19.4 31.8 32.3 69.6 34.6 110.2-2.3 40.6-15.2 78.4-34.6 110.2h-1.2zM244 500c66.7 0 123.6-43.5 146.1-103.1H97.9C120.4 456.5 177.3 500 244 500zM449.2 327.4c-21.6-32-34.1-70-34.1-111.4s12.5-79.4 34.1-111.4h1.2c19.4 31.8 32.3 69.6 34.6 110.2-2.3 40.6-15.2 78.4-34.6 110.2h-1.2zM244 20c66.7 0 123.6 43.5 146.1 103.1H97.9C120.4 63.5 177.3 20 244 20z"></path>
  </svg>
);


export default function SignInForm() {
  const router = useRouter();
  const { user, loading, loginAs } = useAuth();
  
  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);
  
  const handleLogin = (role: 'user' | 'admin' | 'superadmin') => {
      loginAs(role);
      router.push('/');
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Prototype Login</CardTitle>
        <CardDescription>Select a user role to sign in.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full" onClick={() => handleLogin('user')}>
          Login as Standard User
        </Button>
         <Button className="w-full" variant="secondary" onClick={() => handleLogin('admin')}>
          Login as Admin
        </Button>
         <Button className="w-full" variant="outline" onClick={() => handleLogin('superadmin')}>
          Login as Super Admin
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>
        </div>
        <Button className="w-full" variant="outline" disabled>
          <GoogleIcon />
          Sign in with Google (Disabled)
        </Button>
      </CardContent>
       <CardFooter className="justify-center text-sm">
        <p>This is a prototype. No sign up is needed.</p>
      </CardFooter>
    </Card>
  );
}
