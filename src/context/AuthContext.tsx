
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
    User,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, getDocs, deleteDoc, query, writeBatch } from 'firebase/firestore';


const INITIAL_ADMINS: AdminUser[] = [
    { email: 'promiseoyedele07@gmail.com', role: 'Super Admin'},
];

type SelectedRole = 'admin' | 'user' | null;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profileLoading: boolean; // Explicitly track profile loading
  userProfile: UserProfile | null | undefined; // undefined means it's still loading
  isAdmin: boolean;
  rawIsAdmin: boolean; // The check without considering selected role
  adminRole: AdminRole | null;
  isSuperAdmin: boolean;
  admins: AdminUser[];
  addAdmin: (email: string, role: AdminRole, categories?: string[]) => Promise<void>;
  removeAdmin: (email: string) => Promise<void>;
  updateAdminRole: (email: string, role: AdminRole, categories?: string[]) => Promise<void>;
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
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
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
  const [profileLoading, setProfileLoading] = useState(true);
  const [rawIsAdmin, setRawIsAdmin] = useState(false); // The real admin status
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null | undefined>(undefined);
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

  // Effect for handling auth state changes from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Auth check is done
    });
    return () => unsubscribe();
  }, []);

  // Effect for handling profile and admin status once user object is available
  useEffect(() => {
    if (loading || admins.length === 0) return; // Wait for auth and initial admin list

    const checkUserStatus = (currentUser: User | null) => {
      if (currentUser) {
        const adminInfo = admins.find(admin => admin.email === currentUser.email);
        const userIsAdmin = !!adminInfo;
        
        setRawIsAdmin(userIsAdmin);
        
        if (userIsAdmin) {
          setAdminRole(adminInfo.role);
          setManagedCategories(adminInfo.managedCategories || null);
          const roleFromSession = sessionStorage.getItem('selectedRole') as SelectedRole;
          if (roleFromSession) {
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
        setManagedCategories(null);
        setSelectedRole(null);
        setHasSelectedRole(false);
      }
    };

    checkUserStatus(user);
  }, [user, loading, admins]);

  
  // Listen for total users
  useEffect(() => {
      const profilesCollection = collection(db, 'profiles');
      const unsubscribe = onSnapshot(profilesCollection, (snapshot) => {
          setTotalUsers(snapshot.size);
      });
      return () => unsubscribe();
  }, []);

  // Listen to profile changes for the logged-in user
  useEffect(() => {
    if (user) {
      setProfileLoading(true);
      const profileDocRef = doc(db, 'profiles', user.uid);
      const unsubscribe = onSnapshot(profileDocRef, (doc) => {
        if (doc.exists()) {
          setUserProfile(doc.data() as UserProfile);
        } else {
          setUserProfile(null);
        }
        setProfileLoading(false);
      });
      return () => unsubscribe();
    } else {
      setUserProfile(null);
      setProfileLoading(false);
    }
  }, [user]);

  // Listen for admin list changes
  useEffect(() => {
    const adminsCollection = collection(db, 'admins');
    
    const unsubscribe = onSnapshot(adminsCollection, async (snapshot) => {
      let adminList: AdminUser[];
      if (snapshot.empty) {
        const batch = writeBatch(db);
        INITIAL_ADMINS.forEach(admin => {
          const adminDocRef = doc(adminsCollection, admin.email);
          batch.set(adminDocRef, admin);
        });
        await batch.commit();
        adminList = INITIAL_ADMINS;
      } else {
        adminList = snapshot.docs.map(doc => doc.data() as AdminUser);
      }
      setAdmins(adminList);
    });

    return () => unsubscribe();
  }, []);

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
    return { user: userCredential.user, isNewUser: true };
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user || !user.email) {
      throw new Error('You must be logged in to change your password.');
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
    } catch (error: any) {
        if (error.code === 'auth/wrong-password') {
            throw new Error('The current password you entered is incorrect.');
        }
        throw new Error('An error occurred. Please try again.');
    }
  };

  const logOut = async () => {
    await signOut(auth);
    await selectRole(null);
  };
  
  const addAdmin = async (email: string, role: AdminRole, categories: string[] = []) => {
    const adminsCollection = collection(db, 'admins');
    await setDoc(doc(adminsCollection, email), { email, role, managedCategories: categories });
  };
  
  const removeAdmin = async (email: string) => {
    const adminDocRef = doc(db, 'admins', email);
    await deleteDoc(adminDocRef);
  };

  const updateAdminRole = async (email: string, role: AdminRole, categories: string[] = []) => {
    const adminDocRef = doc(db, 'admins', email);
    await setDoc(adminDocRef, { email, role, managedCategories: categories }, { merge: true });
  };

  const saveUserProfile = async (profileData: Omit<UserProfile, 'balance' | 'isComplete'>) => {
     if (user) {
         const profileRef = doc(db, 'profiles', user.uid);
         const currentProfile = userProfile;
         await setDoc(profileRef, { 
             ...profileData, 
             balance: currentProfile?.balance || 0,
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
    profileLoading,
    userProfile,
    isAdmin,
    rawIsAdmin,
    adminRole,
    isSuperAdmin,
    admins,
    addAdmin,
    removeAdmin,
    updateAdminRole,
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
    changePassword,
    selectedRole,
    selectRole,
    hasSelectedRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
