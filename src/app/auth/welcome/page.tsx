
import WelcomeForm from '@/components/auth/WelcomeForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome to Lautech Shoppa',
  description: 'Please complete your profile to get started.',
};

export default function WelcomePage() {
  return (
    <div className="container mx-auto flex items-center justify-center py-12 md:py-24">
      <WelcomeForm />
    </div>
  );
}
