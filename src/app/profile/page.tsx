
import { Metadata } from 'next';
import ProfileClientPage from '@/components/profile/ProfileClientPage';

export const metadata: Metadata = {
  title: 'Profile Settings - Lautech Shoppa',
  description: 'Manage your account details and preferences.',
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 md:py-12">
       <h1 className="text-3xl md:text-4xl font-bold mb-8 font-headline">Profile Settings</h1>
       <ProfileClientPage />
    </div>
  );
}
