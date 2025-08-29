
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  userProfile: UserProfile | null;
  saveUserProfile: (profile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  userProfile: null,
  saveUserProfile: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const adminEmails = ['oyedelepromise07@gmail.com', 'promiseoyedele07@gmail.com'];


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsAdmin(adminEmails.includes(user.email || ''));
        // Load user profile from local storage
        try {
            const savedProfile = localStorage.getItem(`user_profile_${user.uid}`);
            if (savedProfile) {
                setUserProfile(JSON.parse(savedProfile));
            }
        } catch (error) {
            console.error('Failed to load user profile', error);
            setUserProfile(null);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setUserProfile(null);
      }
      setTimeout(() => setLoading(false), 200);
    });
    return () => unsubscribe();
  }, []);

  const saveUserProfile = (profile: UserProfile) => {
      if (user) {
          try {
              localStorage.setItem(`user_profile_${user.uid}`, JSON.stringify(profile));
              setUserProfile(profile);
          } catch (error) {
              console.error('Failed to save user profile', error);
          }
      }
  };


  const value = { user, loading, isAdmin, userProfile, saveUserProfile };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
