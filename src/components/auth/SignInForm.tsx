
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512S0 403.3 0 261.8C0 120.3 106.5 8 244 8s244 112.3 244 253.8zM138.3 327.4c-21.6-32-34.1-70-34.1-111.4s12.5-79.4 34.1-111.4h1.2c19.4 31.8 32.3 69.6 34.6 110.2-2.3 40.6-15.2 78.4-34.6 110.2h-1.2zM244 500c66.7 0 123.6-43.5 146.1-103.1H97.9C120.4 456.5 177.3 500 244 500zM449.2 327.4c-21.6-32-34.1-70-34.1-111.4s12.5-79.4 34.1-111.4h1.2c19.4 31.8 32.3 69.6 34.6 110.2-2.3 40.6-15.2 78.4-34.6 110.2h-1.2zM244 20c66.7 0 123.6 43.5 146.1 103.1H97.9C120.4 63.5 177.3 20 244 20z"></path>
  </svg>
);


export default function SignInForm() {
  const router = useRouter();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
        <CardDescription>Sign in to continue to your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" onClick={handleGoogleSignIn}>
          <GoogleIcon />
          Sign in with Google
        </Button>
      </CardContent>
    </Card>
  );
}
