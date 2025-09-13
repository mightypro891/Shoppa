
import SignInForm from '@/components/auth/SignInForm';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign In - Lautech Shoppa',
  description: 'Sign in to your Lautech Shoppa account.',
};

function SignInFallback() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  )
}

function SignInPageComponent() {
  return (
    <div className="container mx-auto flex items-center justify-center py-12 md:py-24">
      <SignInForm />
    </div>
  )
}


export default function SignInPage() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInPageComponent />
    </Suspense>
  );
}
