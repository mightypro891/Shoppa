
import AppLayout from '@/app/(app)/layout';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change Password - Shoppa',
  description: 'Update your account password.',
};

export default function ChangePasswordPage() {
  return (
    <AppLayout>
      <div className="container mx-auto max-w-2xl py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 font-headline">Change Password</h1>
        <ChangePasswordForm />
      </div>
    </AppLayout>
  );
}
