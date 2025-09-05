
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { UserProfile, AdminUser, AdminRole, CelebrationPopupConfig } from '@/lib/types';
import { auth } from '@/lib/firebase';
import { 
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    User
} from 'firebase/auth';

// --- PRODUCTION AUTH SYSTEM ---
// This context now uses Firebase Authentication.
// User profiles and admin roles are still managed locally for now.

const INITIAL_ADMINS: AdminUser[] = [
    { email: 'promiseoyedele07@gmail.com', role: 'Super Admin'},
    { email: 'websiteadmin@example.com', role: 'Website Admin'},
    { email: 'productsadmin@example.com', role: 'Products Admin'},
    { email: 'normaladmin@example.com', role: 'Normal Admin', managedCategories: ['food', 'kitchen-utensils'] },
];

interface AuthContextType {
  user: User | null;
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
  googleSignIn: () => Promise<void>;
  logOut: () => Promise<void>;
  emailSignUp: (name:string, email:string, password:string) => Promise<User>;
  emailSignIn: (email:string, password:string) => Promise<User>;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL_ADMINS);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [accountBalance, setAccountBalance] = useState(2500);
  const [managedCategories, setManagedCategories] = useState<string[] | null>(null);
  const [totalUsers, setTotalUsers] = useState(0); // This would come from a db
  const [onlineUsers, setOnlineUsers] = useState(1); // This would come from a db
  const [celebrationPopupConfig, setCelebrationPopupConfig] = useState<CelebrationPopupConfig | null>({
      title: 'Welcome Back!',
      message: 'Thanks for trying out the prototype. All items are 10% off!',
      isActive: false,
  });

  const updateUserState = (currentUser: User | null) => {
      setUser(currentUser);
      
      if (currentUser) {
          const adminInfo = admins.find(admin => admin.email === currentUser.email);

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
          
          // In a real app, profile data would be fetched from Firestore
          setUserProfile({
              phone: '', // placeholder
              address: '', // placeholder
              city: '', // placeholder
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setLoading(true);
        updateUserState(currentUser);
    });

    return () => unsubscribe();
  }, [admins, accountBalance]);


  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };
  
  const emailSignIn = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const emailSignUp = async (name: string, email: string, password: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential.user;
  };


  const logOut = async () => {
    await signOut(auth);
  };
  
  const addAdmin = async (email: string, role: AdminRole, categories: string[] = []) => {
    // In real app, this would update Firestore
    setAdmins(prev => [...prev, { email, role, managedCategories: categories }]);
  };
  
  const removeAdmin = async (email: string) => {
    // In real app, this would update Firestore
    setAdmins(prev => prev.filter(admin => admin.email !== email));
  };

  const updateAdminRole = async (email: string, role: AdminRole, categories: string[] = []) => {
    // In real app, this would update Firestore
    setAdmins(prev => prev.map(admin => admin.email === email ? { ...admin, role, managedCategories: categories } : admin));
  };

  const saveUserProfile = async (profileData: Omit<UserProfile, 'balance'>) => {
     // In real app, this would update Firestore
     if (user) {
         setUserProfile({ ...profileData, balance: accountBalance });
     }
  };

  const fundAccount = async (amount: number) => {
    if (user && amount > 0) {
      // In real app, this would be a transaction
      setAccountBalance(prev => prev + amount);
    }
  };

  const payWithWallet = (amount: number): boolean => {
    if (user && amount > 0 && accountBalance >= amount) {
      // In real app, this would be a transaction
      setAccountBalance(prev => prev - amount);
      return true;
    }
    return false;
  };
  
  const updateCelebrationPopupConfig = (config: CelebrationPopupConfig) => {
    // In real app, this would update Firestore/Remote Config
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
