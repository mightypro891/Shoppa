
import SignUpForm from '@/components/auth/SignUpForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Lautech Shoppa',
  description: 'Create a new Lautech Shoppa account.',
};

export default function SignUpPage() {
  return (
    <div className="container mx-auto flex items-center justify-center py-12 md:py-24">
      <SignUpForm />
    </div>
  );
}
