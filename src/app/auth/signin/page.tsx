
import SignInForm from '@/components/auth/SignInForm';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Sign In - Lautech Shoppa',
  description: 'Sign in to your Lautech Shoppa account.',
};

export default function SignInPage() {
  return (
    <div className="container mx-auto flex items-center justify-center py-12 md:py-24">
      <Suspense fallback={<div>Loading...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
