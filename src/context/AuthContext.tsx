
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { UserProfile, AdminUser, AdminRole, CelebrationPopupConfig } from '@/lib/types';
import { auth, db } from '@/lib/firebase';
import { 
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
    User
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';


const INITIAL_ADMINS: AdminUser[] = [
    { email: 'promiseoyedele07@gmail.com', role: 'Super Admin'},
    { email: 'websiteadmin@example.com', role: 'Website Admin'},
    { email: 'productsadmin@example.com', role: 'Products Admin'},
    { email: 'normaladmin@example.com', role: 'Normal Admin', managedCategories: ['food', 'kitchen-utensils'] },
    { email: 'adedoyinadunni0106@gmail.com', role: 'Products Admin' },
];

type SelectedRole = 'admin' | 'user' | null;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  rawIsAdmin: boolean; // The check without considering selected role
  adminRole: AdminRole | null;
  isSuperAdmin: boolean;
  admins: AdminUser[];
  addAdmin: (email: string, role: AdminRole, categories?: string[]) => Promise<void>;
  removeAdmin: (email: string) => Promise<void>;
  updateAdminRole: (email: string, role: AdminRole, categories?: string[]) => Promise<void>;
  userProfile: UserProfile | null;
  saveUserProfile: (profile: Omit<UserProfile, 'balance' | 'isComplete'>) => Promise<void>;
  accountBalance: number;
  fundAccount: (amount: number) => Promise<void>;
  payWithWallet: (amount: number) => boolean;
  managedCategories: string[] | null;
  totalUsers: number;
  onlineUsers: number;
  celebrationPopupConfig: CelebrationPopupConfig | null;
  updateCelebrationPopupConfig: (config: CelebrationPopupConfig) => void;
  googleSignIn: () => Promise<{user: User; isNewUser: boolean}>;
  logOut: () => Promise<void>;
  emailSignUp: (name:string, email:string, password:string) => Promise<{user: User; isNewUser: boolean}>;
  emailSignIn: (email:string, password:string) => Promise<User | null>;
  sendPasswordReset: (email: string) => Promise<void>;
  selectedRole: SelectedRole;
  selectRole: (role: SelectedRole) => Promise<void>;
  hasSelectedRole: boolean;
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
  const [rawIsAdmin, setRawIsAdmin] = useState(false); // The real admin status
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL_ADMINS);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [managedCategories, setManagedCategories] = useState<string[] | null>(null);
  const [totalUsers, setTotalUsers] = useState(0); 
  const [onlineUsers, setOnlineUsers] = useState(1);
  const [celebrationPopupConfig, setCelebrationPopupConfig] = useState<CelebrationPopupConfig | null>({
      title: 'Welcome Back!',
      message: 'Thanks for trying out the prototype. All items are 10% off!',
      isActive: false,
  });
  const [selectedRole, setSelectedRole] = useState<SelectedRole>(null);
  const [hasSelectedRole, setHasSelectedRole] = useState(false);

  const accountBalance = userProfile?.balance ?? 0;
  const isAdmin = rawIsAdmin && selectedRole === 'admin';
  const isSuperAdmin = adminRole === 'Super Admin' && selectedRole === 'admin';

  const selectRole = async (role: SelectedRole) => {
    return new Promise<void>((resolve) => {
      if (role) {
        sessionStorage.setItem('selectedRole', role);
        setSelectedRole(role);
        setHasSelectedRole(true);
      } else {
        sessionStorage.removeItem('selectedRole');
        setSelectedRole(null);
        setHasSelectedRole(false);
      }
      setTimeout(resolve, 50);
    });
  }

  const updateUserState = (currentUser: User | null) => {
      setUser(currentUser);
      
      if (currentUser) {
          const adminInfo = admins.find(admin => admin.email === currentUser.email);
          const userIsAdmin = !!adminInfo;
          
          setRawIsAdmin(userIsAdmin);
          
          if (userIsAdmin) {
              setAdminRole(adminInfo.role);
              setManagedCategories(adminInfo.managedCategories || null);
              const roleFromSession = sessionStorage.getItem('selectedRole') as SelectedRole;
              if(roleFromSession) {
                  setSelectedRole(roleFromSession);
                  setHasSelectedRole(true);
              } else {
                  setHasSelectedRole(false);
              }
          } else {
              setAdminRole(null);
              setManagedCategories(null);
              setSelectedRole('user');
              setHasSelectedRole(true);
          }
      } else {
          setRawIsAdmin(false);
          setAdminRole(null);
          setUserProfile(null);
          setManagedCategories(null);
          setSelectedRole(null);
          setHasSelectedRole(false);
      }
      setLoading(false);
  }
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setLoading(true);
        updateUserState(currentUser);
    });
    return () => unsubscribe();
  }, [admins]);

  useEffect(() => {
    if (user) {
        const profileDocRef = doc(db, 'profiles', user.uid);
        const unsubscribe = onSnapshot(profileDocRef, (doc) => {
            if (doc.exists()) {
                setUserProfile(doc.data() as UserProfile);
            } else {
                // For new users, create a default profile structure
                setUserProfile({
                    phone: '',
                    address: '',
                    city: '',
                    campus: 'Ogbomoso',
                    balance: 0,
                    isComplete: false,
                });
            }
        });
        return () => unsubscribe();
    } else {
        setUserProfile(null);
    }
  }, [user]);

  const googleSignIn = async (): Promise<{user: User; isNewUser: boolean}> => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const profileRef = doc(db, 'profiles', result.user.uid);
    const profileSnap = await getDoc(profileRef);
    return { user: result.user, isNewUser: !profileSnap.exists() };
  };
  
  const emailSignIn = async (email: string, password: string): Promise<User | null> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const emailSignUp = async (name: string, email: string, password: string): Promise<{user: User; isNewUser: boolean}> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    // This will trigger the onAuthStateChanged listener which handles the rest.
    // We return isNewUser: true to ensure correct redirection.
    return { user: userCredential.user, isNewUser: true };
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  };

  const logOut = async () => {
    await signOut(auth);
    await selectRole(null);
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

  const saveUserProfile = async (profileData: Omit<UserProfile, 'balance' | 'isComplete'>) => {
     if (user) {
         const profileRef = doc(db, 'profiles', user.uid);
         await setDoc(profileRef, { 
             ...profileData, 
             balance: userProfile?.balance || 0,
             isComplete: true 
            }, { merge: true });
     }
  };

  const fundAccount = async (amount: number) => {
    if (user && amount > 0) {
      const profileRef = doc(db, 'profiles', user.uid);
      const newBalance = (userProfile?.balance || 0) + amount;
      await setDoc(profileRef, { balance: newBalance }, { merge: true });
    }
  };

  const payWithWallet = (amount: number): boolean => {
    if (user && amount > 0 && accountBalance >= amount) {
      const profileRef = doc(db, 'profiles', user.uid);
      const newBalance = accountBalance - amount;
      setDoc(profileRef, { balance: newBalance }, { merge: true });
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
    rawIsAdmin,
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
    sendPasswordReset,
    selectedRole,
    selectRole,
    hasSelectedRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
