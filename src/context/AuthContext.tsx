
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  admins: string[];
  addAdmin: (email: string) => void;
  removeAdmin: (email: string) => void;
  userProfile: UserProfile | null;
  saveUserProfile: (profile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  isSuperAdmin: false,
  admins: [],
  addAdmin: () => {},
  removeAdmin: () => {},
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

const superAdminEmail = 'promiseoyedele07@gmail.com';
const ADMIN_EMAILS_KEY = 'lautech_shoppa_admins';

const getAdminsFromStorage = (): string[] => {
    if (typeof window === 'undefined') {
        return [superAdminEmail, 'adedolapotamara@gmail.com'];
    }
    try {
        const savedAdmins = localStorage.getItem(ADMIN_EMAILS_KEY);
        if (savedAdmins) {
            return JSON.parse(savedAdmins);
        } else {
            // Initialize with default admins if nothing is in storage
            const defaultAdmins = [superAdminEmail, 'adedolapotamara@gmail.com'];
            localStorage.setItem(ADMIN_EMAILS_KEY, JSON.stringify(defaultAdmins));
            return defaultAdmins;
        }
    } catch (error) {
        console.error('Failed to parse admins from localStorage', error);
        return [superAdminEmail, 'adedolapotamara@gmail.com'];
    }
};

const saveAdminsToStorage = (admins: string[]) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(ADMIN_EMAILS_KEY, JSON.stringify(admins));
    } catch (error) {
        console.error('Failed to save admins to localStorage', error);
    }
};


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [admins, setAdmins] = useState<string[]>(getAdminsFromStorage());
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userEmail = user.email || '';
        setUser(user);
        setIsAdmin(admins.includes(userEmail));
        setIsSuperAdmin(userEmail === superAdminEmail);
        
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
        setIsSuperAdmin(false);
        setUserProfile(null);
      }
      setTimeout(() => setLoading(false), 200);
    });
    return () => unsubscribe();
  }, [admins]);

  const addAdmin = (email: string) => {
      if (isSuperAdmin) {
          setAdmins(prevAdmins => {
              if (prevAdmins.includes(email)) return prevAdmins;
              const newAdmins = [...prevAdmins, email];
              saveAdminsToStorage(newAdmins);
              return newAdmins;
          });
      }
  };

  const removeAdmin = (email: string) => {
      if (isSuperAdmin && email !== superAdminEmail) {
          setAdmins(prevAdmins => {
              const newAdmins = prevAdmins.filter(admin => admin !== email);
              saveAdminsToStorage(newAdmins);
              return newAdmins;
          });
      }
  };


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


  const value = { user, loading, isAdmin, isSuperAdmin, admins, addAdmin, removeAdmin, userProfile, saveUserProfile };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
