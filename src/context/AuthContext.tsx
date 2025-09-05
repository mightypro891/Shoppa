
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, query, getDocs } from 'firebase/firestore';
import type { UserProfile, AdminUser, AdminRole, CelebrationPopupConfig } from '@/lib/types';

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
  googleSignIn: () => void;
  logOut: () => void;
  emailSignUp: (email:string, password:string) => Promise<User>;
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
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [managedCategories, setManagedCategories] = useState<string[] | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [celebrationPopupConfig, setCelebrationPopupConfig] = useState<CelebrationPopupConfig | null>(null);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const emailSignUp = async (email:string, password:string):Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }
   const emailSignIn = async (email:string, password:string):Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  const logOut = () => {
    signOut(auth);
  };
  
  const addAdmin = async (email: string, role: AdminRole, categories: string[] = []) => {
    const adminRef = doc(db, 'admins', email);
    await setDoc(adminRef, { role, managedCategories: categories });
  };
  
  const removeAdmin = async (email: string) => {
    const adminRef = doc(db, 'admins', email);
    await setDoc(adminRef, { role: 'user' }); // Or delete the document
  };

  const updateAdminRole = async (email: string, role: AdminRole, categories: string[] = []) => {
     const adminRef = doc(db, 'admins', email);
     await setDoc(adminRef, { role, managedCategories: categories }, { merge: true });
  };

  const saveUserProfile = async (profileData: Omit<UserProfile, 'balance'>) => {
    if (user) {
      const profileRef = doc(db, 'profiles', user.uid);
      await setDoc(profileRef, profileData, { merge: true });
    }
  };

  const fundAccount = async (amount: number) => {
    if (user && amount > 0) {
      const newBalance = accountBalance + amount;
      const profileRef = doc(db, 'profiles', user.uid);
      await setDoc(profileRef, { balance: newBalance }, { merge: true });
    }
  };

  const payWithWallet = (amount: number): boolean => {
    if (user && amount > 0 && accountBalance >= amount) {
      const newBalance = accountBalance - amount;
      const profileRef = doc(db, 'profiles', user.uid);
      setDoc(profileRef, { balance: newBalance }, { merge: true });
      return true;
    }
    return false;
  };
  
  const updateCelebrationPopupConfig = async (config: CelebrationPopupConfig) => {
    const configRef = doc(db, 'config', 'celebrationPopup');
    await setDoc(configRef, config);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const adminDocRef = doc(db, 'admins', user.email!);
      const unsubscribeAdmin = onSnapshot(adminDocRef, (doc) => {
        if (doc.exists()) {
          const adminData = doc.data() as AdminUser;
          setIsAdmin(true);
          setAdminRole(adminData.role);
          setIsSuperAdmin(adminData.role === 'Super Admin');
          if (adminData.role === 'Normal Admin' && adminData.managedCategories) {
            setManagedCategories(adminData.managedCategories);
          } else {
            setManagedCategories(null);
          }
        } else {
          setIsAdmin(false);
          setAdminRole(null);
          setIsSuperAdmin(false);
          setManagedCategories(null);
        }
      });

      const profileDocRef = doc(db, 'profiles', user.uid);
      const unsubscribeProfile = onSnapshot(profileDocRef, async (doc) => {
        if (doc.exists()) {
          const profileData = doc.data() as UserProfile;
          setUserProfile(profileData);
          setAccountBalance(profileData.balance || 0);
        } else {
          const defaultProfile: UserProfile = { phone: '', address: '', city: '', balance: 0 };
          await setDoc(profileDocRef, defaultProfile);
          setUserProfile(defaultProfile);
          setAccountBalance(0);
        }
        setLoading(false); // Set loading to false after profile is handled
      });
      
      return () => {
        unsubscribeAdmin();
        unsubscribeProfile();
      };
    } else {
      // When user is null, reset all related states
      setIsAdmin(false);
      setAdminRole(null);
      setIsSuperAdmin(false);
      setManagedCategories(null);
      setUserProfile(null);
      setAccountBalance(0);
    }
  }, [user]);
  
  useEffect(() => {
        const fetchAdmins = async () => {
            const q = query(collection(db, 'admins'));
            const querySnapshot = await getDocs(q);
            const adminList = querySnapshot.docs.map(doc => ({ email: doc.id, ...doc.data() } as AdminUser));
            setAdmins(adminList);
        };
        if(isSuperAdmin) {
            fetchAdmins();
        }
  }, [isSuperAdmin]);
  
    useEffect(() => {
        const configRef = doc(db, 'config', 'celebrationPopup');
        const unsubscribe = onSnapshot(configRef, (doc) => {
            if (doc.exists()) {
                setCelebrationPopupConfig(doc.data() as CelebrationPopupConfig);
            }
        });
        return () => unsubscribe();
    }, []);


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
