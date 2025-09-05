
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { UserProfile, AdminUser, AdminRole, CelebrationPopupConfig } from '@/lib/types';
import { initialProducts } from '@/lib/seed';

// --- PROTOTYPE AUTH SYSTEM ---
// This is a mock authentication context for demonstration purposes.
// It simulates user roles and profiles without a real backend.

interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

const MOCK_USERS: { [key: string]: MockUser & { role?: AdminRole, profile?: Omit<UserProfile, 'balance'>, managedCategories?: string[] } } = {
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
  'promiseoyedele07@gmail.com': {
    uid: 'admin_456',
    email: 'promiseoyedele07@gmail.com',
    displayName: 'Super Admin',
    role: 'Super Admin',
    photoURL: 'https://i.pravatar.cc/150?u=admin@example.com',
  },
  'websiteadmin@example.com': {
    uid: 'website_admin_789',
    email: 'websiteadmin@example.com',
    displayName: 'Website Admin',
    role: 'Website Admin',
  },
  'productsadmin@example.com': {
    uid: 'products_admin_012',
    email: 'productsadmin@example.com',
    displayName: 'Products Admin',
    role: 'Products Admin',
  },
  'normaladmin@example.com': {
    uid: 'normal_admin_345',
    email: 'normaladmin@example.com',
    displayName: 'Normal Admin',
    role: 'Normal Admin',
    managedCategories: ['food', 'kitchen-utensils'],
  },
};


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
  const [admins, setAdmins] = useState<AdminUser[]>(Object.values(MOCK_USERS).filter(u => u.role).map(u => ({email: u.email, role: u.role!, managedCategories: u.managedCategories})));
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [accountBalance, setAccountBalance] = useState(2500);
  const [managedCategories, setManagedCategories] = useState<string[] | null>(null);
  const [totalUsers, setTotalUsers] = useState(Object.keys(MOCK_USERS).length);
  const [onlineUsers, setOnlineUsers] = useState(1);
  const [celebrationPopupConfig, setCelebrationPopupConfig] = useState<CelebrationPopupConfig | null>({
      title: 'Welcome Back!',
      message: 'Thanks for trying out the prototype. All items are 10% off!',
      isActive: false,
  });

  const updateUserState = (userData: MockUser | null) => {
      setLoading(true);
      setUser(userData);
      
      if (userData && userData.email in MOCK_USERS) {
          const mock_user = MOCK_USERS[userData.email];
          const role = mock_user.role;
          if (role) {
              setIsAdmin(true);
              setAdminRole(role);
              setIsSuperAdmin(role === 'Super Admin');
              setManagedCategories(mock_user.managedCategories || null);
          } else {
              setIsAdmin(false);
              setAdminRole(null);
              setIsSuperAdmin(false);
              setManagedCategories(null);
          }
          setUserProfile({
              phone: mock_user.profile?.phone || '',
              address: mock_user.profile?.address || '',
              city: mock_user.profile?.city || '',
              balance: accountBalance,
          });
      } else {
          setIsAdmin(false);
          setAdminRole(null);
          setIsSuperAdmin(false);
          setUserProfile(null);
          setManagedCategories(null);
      }
      
      // Simulate loading time
      setTimeout(() => setLoading(false), 500);
  }

  useEffect(() => {
    setLoading(true);
    const storedUserStr = sessionStorage.getItem('mock_user');
    if (storedUserStr) {
      try {
        updateUserState(JSON.parse(storedUserStr));
      } catch (e) {
        updateUserState(null);
      }
    } else {
      updateUserState(null);
    }
    setLoading(false);
  }, []);


  const googleSignIn = () => {
    // In this prototype, we'll just sign in as the main admin user
    const adminUser = MOCK_USERS['promiseoyedele07@gmail.com'];
    sessionStorage.setItem('mock_user', JSON.stringify(adminUser));
    updateUserState(adminUser);
  };
  
  const emailSignIn = async (email: string, password: string): Promise<MockUser> => {
      await new Promise(res => setTimeout(res, 500)); // Simulate network
      if (email in MOCK_USERS) {
          const loggedInUser = MOCK_USERS[email];
          sessionStorage.setItem('mock_user', JSON.stringify(loggedInUser));
          updateUserState(loggedInUser);
          return loggedInUser;
      }
      throw new Error("Invalid credentials. Hint: try user@example.com or promiseoyedele07@gmail.com");
  };

  const emailSignUp = async (name: string, email: string, password: string): Promise<MockUser> => {
      await new Promise(res => setTimeout(res, 500)); // Simulate network
       if (email in MOCK_USERS) {
          throw new Error("An account with this email already exists.");
      }
      const newUser: MockUser = { uid: `user_${Date.now()}`, email, displayName: name };
      MOCK_USERS[email] = newUser;
      sessionStorage.setItem('mock_user', JSON.stringify(newUser));
      updateUserState(newUser);
      return newUser;
  };


  const logOut = () => {
    sessionStorage.removeItem('mock_user');
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
