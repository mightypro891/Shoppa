
'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';

export default function HeroButton() {
    const { isAdmin, loading } = useAuth();

    if (loading) {
        return <Skeleton className="h-12 w-48 rounded-md" />;
    }

    return (
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
            {isAdmin ? (
                 <Link href="/admin">
                    Go to Dashboard
                    <LayoutDashboard className="ml-2 h-5 w-5" />
                </Link>
            ) : (
                <Link href="/products">
                    Start Shopping
                    <ShoppingCart className="ml-2 h-5 w-5" />
                </Link>
            )}
        </Button>
    );
}
