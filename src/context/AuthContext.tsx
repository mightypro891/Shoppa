
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { UserProfile, AdminUser, AdminRole, CelebrationPopupConfig } from '@/lib/types';
import { initialProducts } from '@/lib/seed';

// --- PROTOTYPE AUTH SYSTEM ---
// This is a placeholder authentication context for demonstration purposes.
// It uses localStorage to persist users between sessions.

interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

const INITIAL_MOCK_USERS: { [key: string]: MockUser & { profile?: Omit<UserProfile, 'balance'> } } = {
  'user@example.com': {
    uid: 'user_123',
    email: 'user@example.com',
    displayName: 'Customer User',
    profile: {
      phone: '08012345678',
      address: '123 Main St',
      city: 'Ogbomoso',
    },
  },
    'customer@example.com': {
      uid: 'customer_789',
      email: 'customer@example.com',
      displayName: 'Valued Customer',
  },
  'promiseoyedele07@gmail.com': {
    uid: 'admin_456',
    email: 'promiseoyedele07@gmail.com',
    displayName: 'Super Admin',
    photoURL: 'https://i.pravatar.cc/150?u=admin@example.com',
  },
  'websiteadmin@example.com': {
    uid: 'website_admin_789',
    email: 'websiteadmin@example.com',
    displayName: 'Website Admin',
  },
  'productsadmin@example.com': {
    uid: 'products_admin_012',
    email: 'productsadmin@example.com',
    displayName: 'Products Admin',
  },
  'normaladmin@example.com': {
    uid: 'normal_admin_345',
    email: 'normaladmin@example.com',
    displayName: 'Normal Admin',
  },
};

const INITIAL_ADMINS: AdminUser[] = [
    { email: 'promiseoyedele07@gmail.com', role: 'Super Admin'},
    { email: 'websiteadmin@example.com', role: 'Website Admin'},
    { email: 'productsadmin@example.com', role: 'Products Admin'},
    { email: 'normaladmin@example.com', role: 'Normal Admin', managedCategories: ['food', 'kitchen-utensils'] },
];

const getLocalUsers = () => {
    if (typeof window === 'undefined') return INITIAL_MOCK_USERS;
    const stored = localStorage.getItem('lautech_shoppa_users');
    if (stored) {
        return JSON.parse(stored);
    }
    // On first load, seed with initial users
    localStorage.setItem('lautech_shoppa_users', JSON.stringify(INITIAL_MOCK_USERS));
    return INITIAL_MOCK_USERS;
}

const saveLocalUsers = (users: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('lautech_shoppa_users', JSON.stringify(users));
}


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
  googleSignIn: () => void;
  logOut: () => void;
  emailSignUp: (name:string, email:string, password:string) => Promise<MockUser>;
  emailSignIn: (email:string, password:string) => Promise<MockUser>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL_ADMINS);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [accountBalance, setAccountBalance] = useState(2500);
  const [managedCategories, setManagedCategories] = useState<string[] | null>(null);
  const [totalUsers, setTotalUsers] = useState(Object.keys(getLocalUsers()).length);
  const [onlineUsers, setOnlineUsers] = useState(1);
  const [celebrationPopupConfig, setCelebrationPopupConfig] = useState<CelebrationPopupConfig | null>({
      title: 'Welcome Back!',
      message: 'Thanks for trying out the prototype. All items are 10% off!',
      isActive: false,
  });

  const updateUserState = (userData: MockUser | null) => {
      setUser(userData);
      
      if (userData) {
          const adminInfo = admins.find(admin => admin.email === userData.email);

          if (adminInfo) {
              setIsAdmin(true);
              setAdminRole(adminInfo.role);
              setIsSuperAdmin(adminInfo.role === 'Super Admin');
              setManagedCategories(adminInfo.managedCategories || null);
          } else {
              setIsAdmin(false);
              setAdminRole(null);
              setIsSuperAdmin(false);
              setManagedCategories(null);
          }
          
          const localUsers = getLocalUsers();
          const localUserProfile = localUsers[userData.email]?.profile;
          setUserProfile({
              phone: localUserProfile?.phone || '',
              address: localUserProfile?.address || '',
              city: localUserProfile?.city || '',
              balance: accountBalance,
          });

      } else {
          setIsAdmin(false);
          setAdminRole(null);
          setIsSuperAdmin(false);
          setUserProfile(null);
          setManagedCategories(null);
      }
      
      setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    const storedUserStr = sessionStorage.getItem('lautech_shoppa_session_user');
    if (storedUserStr) {
      try {
        updateUserState(JSON.parse(storedUserStr));
      } catch (e) {
        updateUserState(null);
      }
    } else {
      updateUserState(null);
    }
    setTotalUsers(Object.keys(getLocalUsers()).length);
  }, [admins]);


  const googleSignIn = () => {
    // In this prototype, we'll just sign in as the main admin user
    const localUsers = getLocalUsers();
    const adminUser = localUsers['promiseoyedele07@gmail.com'];
    sessionStorage.setItem('lautech_shoppa_session_user', JSON.stringify(adminUser));
    updateUserState(adminUser);
  };
  
  const emailSignIn = async (email: string, password: string): Promise<MockUser> => {
      await new Promise(res => setTimeout(res, 500)); // Simulate network
      const localUsers = getLocalUsers();
      const userExists = localUsers[email];

      if (userExists) {
          sessionStorage.setItem('lautech_shoppa_session_user', JSON.stringify(userExists));
          updateUserState(userExists);
          return userExists;
      }
      throw new Error("Invalid credentials. Please check your email and password.");
  };

  const emailSignUp = async (name: string, email: string, password: string): Promise<MockUser> => {
      await new Promise(res => setTimeout(res, 500)); // Simulate network
      const localUsers = getLocalUsers();
       if (localUsers[email]) {
          throw new Error("An account with this email already exists.");
      }
      const newUser: MockUser = { uid: `user_${Date.now()}`, email, displayName: name };
      const updatedUsers = {...localUsers, [email]: newUser};
      saveLocalUsers(updatedUsers);
      
      sessionStorage.setItem('lautech_shoppa_session_user', JSON.stringify(newUser));
      updateUserState(newUser);
      setTotalUsers(Object.keys(updatedUsers).length);
      return newUser;
  };


  const logOut = () => {
    sessionStorage.removeItem('lautech_shoppa_session_user');
    updateUserState(null);
  };
  
  const addAdmin = async (email: string, role: AdminRole, categories: string[] = []) => {
    setAdmins(prev => [...prev, { email, role, managedCategories: categories }]);
  };
  
  const removeAdmin = async (email: string) => {
    setAdmins(prev => prev.filter(admin => admin.email !== email));
  };

  const updateAdminRole = async (email: string, role: AdminRole, categories: string[] = []) => {
    setAdmins(prev => prev.map(admin => admin.email === email ? { ...admin, role, managedCategories: categories } : admin));
  };

  const saveUserProfile = async (profileData: Omit<UserProfile, 'balance'>) => {
     if (user) {
         setUserProfile({ ...profileData, balance: accountBalance });
     }
  };

  const fundAccount = async (amount: number) => {
    if (user && amount > 0) {
      setAccountBalance(prev => prev + amount);
    }
  };

  const payWithWallet = (amount: number): boolean => {
    if (user && amount > 0 && accountBalance >= amount) {
      setAccountBalance(prev => prev - amount);
      return true;
    }
    return false;
  };
  
  const updateCelebrationPopupConfig = (config: CelebrationPopupConfig) => {
    setCelebrationPopupConfig(config);
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
    googleSignIn,
    logOut,
    emailSignUp,
    emailSignIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
