
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { UserProfile, AdminUser, AdminRole } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  adminRole: AdminRole | null;
  isSuperAdmin: boolean;
  admins: AdminUser[];
  addAdmin: (email: string, role: AdminRole) => void;
  removeAdmin: (email: string) => void;
  userProfile: UserProfile | null;
  saveUserProfile: (profile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  adminRole: null,
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

const ADMIN_USERS_KEY = 'lautech_shoppa_admin_users';

const getAdminsFromStorage = (): AdminUser[] => {
    const defaultAdmins: AdminUser[] = [
        { email: 'promiseoyedele07@gmail.com', role: 'Super Admin' },
        { email: 'adedolapotamara@gmail.com', role: 'Products Admin' },
    ];

    if (typeof window === 'undefined') {
        return defaultAdmins;
    }
    try {
        const savedAdmins = localStorage.getItem(ADMIN_USERS_KEY);
        if (savedAdmins) {
            return JSON.parse(savedAdmins);
        } else {
            localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(defaultAdmins));
            return defaultAdmins;
        }
    } catch (error) {
        console.error('Failed to parse admins from localStorage', error);
        return defaultAdmins;
    }
};

const saveAdminsToStorage = (admins: AdminUser[]) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(admins));
    } catch (error) {
        console.error('Failed to save admins to localStorage', error);
    }
};


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [admins, setAdmins] = useState<AdminUser[]>(getAdminsFromStorage());
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userEmail = user.email || '';
        const adminRecord = admins.find(admin => admin.email === userEmail);

        setUser(user);
        setIsAdmin(!!adminRecord);
        setAdminRole(adminRecord ? adminRecord.role : null);
        setIsSuperAdmin(adminRecord?.role === 'Super Admin');
        
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
        setAdminRole(null);
        setUserProfile(null);
      }
      setTimeout(() => setLoading(false), 200);
    });
    return () => unsubscribe();
  }, [admins]);

  const addAdmin = (email: string, role: AdminRole) => {
      if (isSuperAdmin) {
          setAdmins(prevAdmins => {
              if (prevAdmins.some(admin => admin.email === email)) return prevAdmins;
              const newAdmins = [...prevAdmins, { email, role }];
              saveAdminsToStorage(newAdmins);
              return newAdmins;
          });
      }
  };

  const removeAdmin = (email: string) => {
      if (isSuperAdmin && email !== 'promiseoyedele07@gmail.com') {
          setAdmins(prevAdmins => {
              const newAdmins = prevAdmins.filter(admin => admin.email !== email);
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


  const value = { user, loading, isAdmin, adminRole, isSuperAdmin, admins, addAdmin, removeAdmin, userProfile, saveUserProfile };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
