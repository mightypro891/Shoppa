
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WishlistContextType {
  wishlist: string[]; // Array of product IDs
  toggleWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const getWishlistKey = () => user ? `wishlist_${user.uid}` : null;

  useEffect(() => {
    const key = getWishlistKey();
    if (key) {
      try {
        const savedWishlist = localStorage.getItem(key);
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        } else {
          setWishlist([]);
        }
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage', error);
        setWishlist([]);
      }
    } else {
        // Clear wishlist if user logs out
        setWishlist([]);
    }
  }, [user]);

  useEffect(() => {
    const key = getWishlistKey();
    if (key) {
      try {
        localStorage.setItem(key, JSON.stringify(wishlist));
      } catch (error) {
        console.error('Failed to save wishlist to localStorage', error);
      }
    }
  }, [wishlist, user]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(productId)) {
        toast({
            title: 'Removed from Wishlist',
            variant: 'destructive'
        })
        return prevWishlist.filter((id) => id !== productId);
      } else {
         toast({
            title: 'Added to Wishlist!',
        })
        return [...prevWishlist, productId];
      }
    });
  };
  
  const clearWishlist = () => {
    setWishlist([]);
  }

  const value = {
    wishlist,
    toggleWishlist,
    clearWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
