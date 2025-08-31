
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
  addAdmin: (email: string, role: AdminRole, categories?: string[]) => void;
  removeAdmin: (email: string) => void;
  updateAdminRole: (email: string, role: AdminRole, categories?: string[]) => void;
  userProfile: UserProfile | null;
  saveUserProfile: (profile: Omit<UserProfile, 'balance'>) => void;
  accountBalance: number;
  fundAccount: (amount: number) => void;
  payWithWallet: (amount: number) => boolean;
  managedCategories: string[] | null;
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
  updateAdminRole: () => {},
  userProfile: null,
  saveUserProfile: () => {},
  accountBalance: 0,
  fundAccount: () => {},
  payWithWallet: () => false,
  managedCategories: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const ADMIN_USERS_KEY = 'lautech_shoppa_admin_users';
const USER_PROFILE_KEY_PREFIX = 'user_profile_';


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
            // Ensure the default admins are always present
            const parsedAdmins = JSON.parse(savedAdmins);
            const allAdmins = [...parsedAdmins];
            defaultAdmins.forEach(defaultAdmin => {
                if (!allAdmins.some(ad => ad.email === defaultAdmin.email)) {
                    allAdmins.push(defaultAdmin);
                }
            });
            return allAdmins;
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

const getProfileFromStorage = (uid: string): UserProfile | null => {
    if (typeof window === 'undefined') return null;
    try {
        const savedProfile = localStorage.getItem(`${USER_PROFILE_KEY_PREFIX}${uid}`);
        return savedProfile ? JSON.parse(savedProfile) : null;
    } catch (error) {
        console.error('Failed to load user profile', error);
        return null;
    }
}

const saveProfileToStorage = (uid: string, profile: UserProfile) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(`${USER_PROFILE_KEY_PREFIX}${uid}`, JSON.stringify(profile));
    } catch (error) {
        console.error('Failed to save user profile', error);
    }
}


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [managedCategories, setManagedCategories] = useState<string[] | null>(null);
  
  useEffect(() => {
    // We only want to load admins from storage once on the client
    setAdmins(getAdminsFromStorage());
  }, []);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userEmail = user.email || '';
        const adminRecord = admins.find(admin => admin.email === userEmail);

        setUser(user);
        setIsAdmin(!!adminRecord);
        setAdminRole(adminRecord ? adminRecord.role : null);
        setIsSuperAdmin(adminRecord?.role === 'Super Admin');
        setManagedCategories(adminRecord?.managedCategories || null);
        
        const profile = getProfileFromStorage(user.uid);
        if (profile) {
            setUserProfile(profile);
            setAccountBalance(profile.balance || 0);
        } else {
            // Create a default profile if none exists
            const defaultProfile: UserProfile = { phone: '', address: '', city: '', balance: 0 };
            setUserProfile(defaultProfile);
            setAccountBalance(0);
            saveProfileToStorage(user.uid, defaultProfile);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setAdminRole(null);
        setUserProfile(null);
        setAccountBalance(0);
        setManagedCategories(null);
      }
      setTimeout(() => setLoading(false), 200);
    });
    return () => unsubscribe();
  }, [admins]);

  const addAdmin = (email: string, role: AdminRole, categories: string[] = []) => {
      if (isSuperAdmin) {
          setAdmins(prevAdmins => {
              if (prevAdmins.some(admin => admin.email === email)) return prevAdmins;
              const newAdmin: AdminUser = { email, role };
              if (role === 'Normal Admin') {
                  newAdmin.managedCategories = categories;
              }
              const newAdmins = [...prevAdmins, newAdmin];
              saveAdminsToStorage(newAdmins);
              return newAdmins;
          });
      }
  };

  const removeAdmin = (email: string) => {
      if (isSuperAdmin) {
           setAdmins(prevAdmins => {
              const newAdmins = prevAdmins.filter(admin => admin.email !== email);
              saveAdminsToStorage(newAdmins);
              return newAdmins;
          });
      }
  };
  
  const updateAdminRole = (email: string, role: AdminRole, categories: string[] = []) => {
    if (isSuperAdmin) {
        setAdmins(prevAdmins => {
            const newAdmins = prevAdmins.map(admin => {
                if (admin.email === email) {
                    const updatedAdmin: AdminUser = { ...admin, role };
                    if (role === 'Normal Admin') {
                        updatedAdmin.managedCategories = categories;
                    } else {
                        delete updatedAdmin.managedCategories;
                    }
                    return updatedAdmin;
                }
                return admin;
            });
            saveAdminsToStorage(newAdmins);
            return newAdmins;
        });
    }
  };

  const saveUserProfile = (profile: Omit<UserProfile, 'balance'>) => {
      if (user) {
          const updatedProfile = { ...profile, balance: accountBalance };
          setUserProfile(updatedProfile);
          saveProfileToStorage(user.uid, updatedProfile);
      }
  };
  
  const fundAccount = (amount: number) => {
      if (user && amount > 0) {
          const newBalance = accountBalance + amount;
          setAccountBalance(newBalance);
          const updatedProfile = { ...userProfile!, balance: newBalance };
          setUserProfile(updatedProfile);
          saveProfileToStorage(user.uid, updatedProfile);
      }
  };

  const payWithWallet = (amount: number): boolean => {
      if (user && amount > 0 && accountBalance >= amount) {
          const newBalance = accountBalance - amount;
          setAccountBalance(newBalance);
          const updatedProfile = { ...userProfile!, balance: newBalance };
          setUserProfile(updatedProfile);
          saveProfileToStorage(user.uid, updatedProfile);
          return true;
      }
      return false;
  };

  const value = { 
      user, 
      loading, 
      isAdmin, 
      adminRole, 
      isSuperAdmin, 
      admins, 
      addAdmin, 
      removeAdmin, 
      updateAdminRole, 
      userProfile, 
      saveUserProfile,
      accountBalance,
      fundAccount,
      payWithWallet,
      managedCategories
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
