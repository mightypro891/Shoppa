
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import type { UserProfile, AdminUser, AdminRole, CelebrationPopupConfig } from '@/lib/types';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  adminRole: null,
  isSuperAdmin: false,
  admins: [],
  addAdmin: async () => {},
  removeAdmin: async () => {},
  updateAdminRole: async () => {},
  userProfile: null,
  saveUserProfile: () => {},
  accountBalance: 0,
  fundAccount: () => {},
  payWithWallet: () => false,
  managedCategories: null,
  totalUsers: 0,
  onlineUsers: 0,
  celebrationPopupConfig: null,
  updateCelebrationPopupConfig: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Local Storage Keys ---
const USER_PROFILE_KEY_PREFIX = 'user_profile_';
const ALL_USERS_KEY = 'lautech_shoppa_all_users';
const USER_ACTIVITY_KEY = 'lautech_shoppa_user_activity';
const POPUP_CONFIG_KEY = 'lautech_shoppa_popup_config';
const ONLINE_THRESHOLD = 60 * 1000; // 1 minute

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
    message: 'Check out our latest products.',
    isActive: false,
};


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
  const [totalUsers, setTotalUsers] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [celebrationPopupConfig, setCelebrationPopupConfig] = useState<CelebrationPopupConfig | null>(() => getFromStorage(POPUP_CONFIG_KEY, defaultPopupConfig));
  

  useEffect(() => {
    // We only want to load from storage once on the client
    setTotalUsers(getFromStorage<string[]>(ALL_USERS_KEY, []).length);
    setCelebrationPopupConfig(getFromStorage(POPUP_CONFIG_KEY, defaultPopupConfig));
  }, []);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);

        // Check admin status from Firestore
        const adminDocRef = doc(db, 'admins', currentUser.uid);
        const adminDocSnap = await getDoc(adminDocRef);
        
        if (adminDocSnap.exists()) {
            const adminData = adminDocSnap.data() as AdminUser;
            setIsAdmin(true);
            setAdminRole(adminData.role);
            setIsSuperAdmin(adminData.role === 'Super Admin');
            setManagedCategories(adminData.managedCategories || null);
        } else {
            setIsAdmin(false);
            setAdminRole(null);
            setIsSuperAdmin(false);
            setManagedCategories(null);
        }
        
        // Fetch user profile from localStorage
        const profile = getFromStorage<UserProfile | null>(`${USER_PROFILE_KEY_PREFIX}${currentUser.uid}`, null);
        if (profile) {
            setUserProfile(profile);
            setAccountBalance(profile.balance || 0);
        } else {
            const defaultProfile: UserProfile = { phone: '', address: '', city: '', balance: 0 };
            setUserProfile(defaultProfile);
            setAccountBalance(0);
            saveToStorage(`${USER_PROFILE_KEY_PREFIX}${currentUser.uid}`, defaultProfile);
        }

        // Track total unique users
        const allUsers = getFromStorage<string[]>(ALL_USERS_KEY, []);
        if (!allUsers.includes(currentUser.uid)) {
            const newAllUsers = [...allUsers, currentUser.uid];
            saveToStorage(ALL_USERS_KEY, newAllUsers);
            setTotalUsers(newAllUsers.length);
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
  }, []);


  // Effect for tracking user activity
  useEffect(() => {
    let activityInterval: NodeJS.Timeout;
    if (user) {
        const updateActivity = () => {
             const activityData = getFromStorage<Record<string, number>>(USER_ACTIVITY_KEY, {});
             activityData[user.uid] = Date.now();
             saveToStorage(USER_ACTIVITY_KEY, activityData);
        };
        updateActivity(); // Run once immediately
        activityInterval = setInterval(updateActivity, 30 * 1000); // Update every 30 seconds
    }
    return () => clearInterval(activityInterval);
  }, [user]);

  // Effect for checking online users (for admins)
   useEffect(() => {
    let onlineCheckInterval: NodeJS.Timeout;
    if (isAdmin) {
        const checkOnline = () => {
            const activityData = getFromStorage<Record<string, number>>(USER_ACTIVITY_KEY, {});
            const now = Date.now();
            const onlineCount = Object.values(activityData).filter(
                lastSeen => now - lastSeen < ONLINE_THRESHOLD
            ).length;
            setOnlineUsers(onlineCount);
        };
        checkOnline();
        onlineCheckInterval = setInterval(checkOnline, 15 * 1000); // Check every 15 seconds
    }
     return () => clearInterval(onlineCheckInterval);
   }, [isAdmin]);

  const addAdmin = async (email: string, role: AdminRole, categories: string[] = []) => {
      // This is a simplified lookup. In a real app, you'd use a Cloud Function to get user by email.
      // For this prototype, we assume an admin will only be added when that user is logged in on another browser to create the user record.
      // This is a limitation of the client-side approach.
      console.warn("This is a mock implementation. For a real app, use a Cloud Function to find a user's UID by their email.");
  };

  const removeAdmin = async (email: string) => {
    console.warn("removeAdmin is not implemented in this prototype.");
  };
  
  const updateAdminRole = async (email: string, role: AdminRole, categories: string[] = []) => {
    console.warn("updateAdminRole is not implemented in this prototype.");
  };

  const saveUserProfile = (profile: Omit<UserProfile, 'balance'>) => {
      if (user) {
          const currentProfile = getFromStorage<UserProfile | null>(`${USER_PROFILE_KEY_PREFIX}${user.uid}`, null);
          const updatedProfile = { ...currentProfile, ...profile, balance: accountBalance };
          setUserProfile(updatedProfile);
          saveToStorage(`${USER_PROFILE_KEY_PREFIX}${user.uid}`, updatedProfile);
      }
  };
  
  const fundAccount = (amount: number) => {
      if (user && amount > 0) {
          const newBalance = accountBalance + amount;
          setAccountBalance(newBalance);
          const profile = getFromStorage<UserProfile | null>(`${USER_PROFILE_KEY_PREFIX}${user.uid}`, null);
          const updatedProfile = { ...profile!, balance: newBalance };
          setUserProfile(updatedProfile);
          saveToStorage(`${USER_PROFILE_KEY_PREFIX}${user.uid}`, updatedProfile);
      }
  };

  const payWithWallet = (amount: number): boolean => {
      if (user && amount > 0 && accountBalance >= amount) {
          const newBalance = accountBalance - amount;
          setAccountBalance(newBalance);
          const profile = getFromStorage<UserProfile | null>(`${USER_PROFILE_KEY_PREFIX}${user.uid}`, null);
          const updatedProfile = { ...profile!, balance: newBalance };
          setUserProfile(updatedProfile);
          saveToStorage(`${USER_PROFILE_KEY_PREFIX}${user.uid}`, updatedProfile);
          return true;
      }
      return false;
  };

  const updateCelebrationPopupConfig = (config: CelebrationPopupConfig) => {
    setCelebrationPopupConfig(config);
    saveToStorage(POPUP_CONFIG_KEY, config);
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
      updateCelebrationPopupConfig
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
