
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserProfile, AdminUser, AdminRole, CelebrationPopupConfig } from '@/lib/types';

// --- Mock User Data for Prototype ---
const MOCK_USER = {
  uid: 'prototype_user_123',
  displayName: 'Prototype User',
  email: 'user@example.com',
  photoURL: 'https://picsum.photos/100/100',
};

const MOCK_ADMIN = {
  uid: 'prototype_admin_456',
  displayName: 'Admin User',
  email: 'admin@example.com',
  photoURL: 'https://picsum.photos/100/100?grayscale',
};

const MOCK_SUPER_ADMIN = {
  uid: 'prototype_super_admin_789',
  displayName: 'Super Admin',
  email: 'superadmin@example.com',
  photoURL: 'https://picsum.photos/100/100?blur=1',
};

type MockUser = typeof MOCK_USER;


interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  isAdmin: boolean;
  adminRole: AdminRole | null;
  isSuperAdmin: boolean;
  admins: AdminUser[];
  addAdmin: (email: string, role: AdminRole, categories?: string[]) => Promise<void>;
  removeAdmin: (email: string) => Promise<void>;
  updateAdminRole: (email: string, role: AdminRole, categories?: string[]) => Promise<void>;
  userProfile: UserProfile | null;
  saveUserProfile: (profile: Omit<UserProfile, 'balance'>) => void;
  accountBalance: number;
  fundAccount: (amount: number) => void;
  payWithWallet: (amount: number) => boolean;
  managedCategories: string[] | null;
  totalUsers: number;
  onlineUsers: number;
  celebrationPopupConfig: CelebrationPopupConfig | null;
  updateCelebrationPopupConfig: (config: CelebrationPopupConfig) => void;
  // Prototype specific functions
  loginAs: (role: 'user' | 'admin' | 'superadmin' | null) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Local Storage Helpers for Prototype State ---
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
        console.error(`Failed to parse ${key} from localStorage`, error);
        return defaultValue;
    }
}

const saveToStorage = (key: string, data: any) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Failed to save ${key} to localStorage`, error);
    }
};


const defaultPopupConfig: CelebrationPopupConfig = {
    title: 'Welcome!',
    message: 'This is a prototype store. All data is for demonstration purposes.',
    isActive: true,
};


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [managedCategories, setManagedCategories] = useState<string[] | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [celebrationPopupConfig, setCelebrationPopupConfig] = useState<CelebrationPopupConfig | null>(() => getFromStorage('prototype_popup_config', defaultPopupConfig));
  
  const loginAs = (role: 'user' | 'admin' | 'superadmin' | null) => {
      setLoading(true);
      if (role === null) {
          setUser(null);
          setIsAdmin(false);
          setIsSuperAdmin(false);
          setAdminRole(null);
          setManagedCategories(null);
          setAccountBalance(0);
          setUserProfile(null);
      } else {
          let mockUser, roleName: AdminRole | null, categories: string[] | null = null;
          if (role === 'user') {
              mockUser = MOCK_USER;
              roleName = null;
              setIsAdmin(false);
              setIsSuperAdmin(false);
          } else if (role === 'admin') {
              mockUser = MOCK_ADMIN;
              roleName = 'Normal Admin';
              categories = ['food', 'kitchen-utensils'];
              setIsAdmin(true);
              setIsSuperAdmin(false);
          } else { // superadmin
              mockUser = MOCK_SUPER_ADMIN;
              roleName = 'Super Admin';
              categories = null;
              setIsAdmin(true);
              setIsSuperAdmin(true);
          }
          
          setUser(mockUser);
          setAdminRole(roleName);
          setManagedCategories(categories);
          
          const profile = getFromStorage<UserProfile | null>(`prototype_profile_${mockUser.uid}`, { phone: '08012345678', address: '123 Prototype Street', city: 'Nextville', balance: 50000 });
          setUserProfile(profile);
          setAccountBalance(profile?.balance || 50000);
      }
      setTimeout(() => setLoading(false), 300);
  };
  
  // Simulate initial load and check if a user was previously "logged in"
  useEffect(() => {
    const lastRole = getFromStorage<'user' | 'admin' | 'superadmin' | null>('prototype_last_role', null);
    if(lastRole) {
        loginAs(lastRole);
    } else {
        setLoading(false);
    }
    setTotalUsers(3); // Mock value
    setOnlineUsers(2); // Mock value
  }, []);

  // Persist role on change
  useEffect(() => {
    if (user) {
        let role: 'user' | 'admin' | 'superadmin' = 'user';
        if (isSuperAdmin) role = 'superadmin';
        else if (isAdmin) role = 'admin';
        saveToStorage('prototype_last_role', role);
    } else {
        saveToStorage('prototype_last_role', null);
    }
  }, [user, isAdmin, isSuperAdmin]);


  const addAdmin = async (email: string, role: AdminRole, categories: string[] = []) => {
      console.log(`PROTOTYPE: Adding admin ${email} with role ${role}`);
      const newAdmin: AdminUser = { email, role, managedCategories: categories };
      setAdmins(prev => [...prev, newAdmin]);
  };

  const removeAdmin = async (email: string) => {
    console.log(`PROTOTYPE: Removing admin ${email}`);
    setAdmins(prev => prev.filter(admin => admin.email !== email));
  };
  
  const updateAdminRole = async (email: string, role: AdminRole, categories: string[] = []) => {
    console.log(`PROTOTYPE: Updating role for ${email} to ${role}`);
    setAdmins(prev => prev.map(admin => admin.email === email ? { ...admin, role, managedCategories: categories } : admin));
  };

  const saveUserProfile = (profile: Omit<UserProfile, 'balance'>) => {
      if (user) {
          const updatedProfile = { ...userProfile, ...profile, balance: accountBalance };
          setUserProfile(updatedProfile as UserProfile);
          saveToStorage(`prototype_profile_${user.uid}`, updatedProfile);
      }
  };
  
  const fundAccount = (amount: number) => {
      if (user && amount > 0) {
          const newBalance = accountBalance + amount;
          setAccountBalance(newBalance);
          saveUserProfile(userProfile!); // This will re-save with the new balance
      }
  };

  const payWithWallet = (amount: number): boolean => {
      if (user && amount > 0 && accountBalance >= amount) {
          const newBalance = accountBalance - amount;
          setAccountBalance(newBalance);
          saveUserProfile(userProfile!);
          return true;
      }
      return false;
  };

  const updateCelebrationPopupConfig = (config: CelebrationPopupConfig) => {
    setCelebrationPopupConfig(config);
    saveToStorage('prototype_popup_config', config);
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
      managedCategories,
      totalUsers,
      onlineUsers,
      celebrationPopupConfig,
      updateCelebrationPopupConfig,
      loginAs
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
