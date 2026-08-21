import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password - Lautech Shoppa',
  description: 'Reset your Lautech Shoppa account password.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto flex items-center justify-center py-12 md:py-24">
      <ForgotPasswordForm />
    </div>
  );
}
