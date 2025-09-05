
'use client';

import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface WishlistButtonProps extends React.ComponentProps<typeof Button> {
  productId: string;
}

export default function WishlistButton({ productId, className, ...props }: WishlistButtonProps) {
  const { wishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const isInWishlist = wishlist.includes(productId);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
        toast({
            title: "Please sign in",
            description: "You need to be logged in to manage your wishlist.",
            variant: "destructive"
        });
        router.push('/auth/signin');
        return;
    }

    toggleWishlist(productId);
  };

  return (
    <Button
      onClick={handleToggle}
      variant="outline"
      size="icon"
      className={cn(
        'bg-background/60 hover:bg-background/90 backdrop-blur-sm',
        className
      )}
      {...props}
    >
      <Heart className={cn('h-5 w-5', isInWishlist ? 'fill-red-500 text-red-500' : 'text-foreground')} />
      <span className="sr-only">Add to Wishlist</span>
    </Button>
  );
}
