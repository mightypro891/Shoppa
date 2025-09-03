
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { UserProfile, AdminUser, AdminRole, CelebrationPopupConfig } from '@/lib/types';

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
  addAdmin: () => {},
  removeAdmin: () => {},
  updateAdminRole: () => {},
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

const ADMIN_USERS_KEY = 'lautech_shoppa_admin_users';
const USER_PROFILE_KEY_PREFIX = 'user_profile_';
const ALL_USERS_KEY = 'lautech_shoppa_all_users';
const USER_ACTIVITY_KEY = 'lautech_shoppa_user_activity';
const POPUP_CONFIG_KEY = 'lautech_shoppa_popup_config';
const ONLINE_THRESHOLD = 60 * 1000; // 1 minute


const getFromStorage = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') {
        return defaultValue;
    }
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

const defaultAdmins: AdminUser[] = [
    { email: 'promiseoyedele07@gmail.com', role: 'Super Admin' },
    { email: 'adedolapotamara@gmail.com', role: 'Products Admin' },
];

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
  const [admins, setAdmins] = useState<AdminUser[]>(() => getFromStorage(ADMIN_USERS_KEY, defaultAdmins));
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [managedCategories, setManagedCategories] = useState<string[] | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [celebrationPopupConfig, setCelebrationPopupConfig] = useState<CelebrationPopupConfig | null>(() => getFromStorage(POPUP_CONFIG_KEY, defaultPopupConfig));
  
  useEffect(() => {
    // We only want to load from storage once on the client
     const storedAdmins = getFromStorage(ADMIN_USERS_KEY, defaultAdmins);
      // Ensure default admins are always present
      defaultAdmins.forEach(defaultAdmin => {
          if (!storedAdmins.some(ad => ad.email === defaultAdmin.email)) {
              storedAdmins.push(defaultAdmin);
          }
      });
      setAdmins(storedAdmins);
      saveToStorage(ADMIN_USERS_KEY, storedAdmins);

      setTotalUsers(getFromStorage<string[]>(ALL_USERS_KEY, []).length);
      setCelebrationPopupConfig(getFromStorage(POPUP_CONFIG_KEY, defaultPopupConfig));
  }, []);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userEmail = currentUser.email || '';
        const adminRecord = admins.find(admin => admin.email === userEmail);

        setUser(currentUser);
        setIsAdmin(!!adminRecord);
        setAdminRole(adminRecord ? adminRecord.role : null);
        setIsSuperAdmin(adminRecord?.role === 'Super Admin');
        setManagedCategories(adminRecord?.managedCategories || null);
        
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
  }, [admins]);


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

  const updateAdminStorage = (newAdmins: AdminUser[]) => {
    setAdmins(newAdmins);
    saveToStorage(ADMIN_USERS_KEY, newAdmins);
  }

  const addAdmin = (email: string, role: AdminRole, categories: string[] = []) => {
      if (isSuperAdmin) {
          const currentAdmins = getFromStorage<AdminUser[]>(ADMIN_USERS_KEY, []);
          if (currentAdmins.some(admin => admin.email === email)) return;
          const newAdmin: AdminUser = { email, role };
          if (role === 'Normal Admin') {
              newAdmin.managedCategories = categories;
          }
          updateAdminStorage([...currentAdmins, newAdmin]);
      }
  };

  const removeAdmin = (email: string) => {
      if (isSuperAdmin) {
           const currentAdmins = getFromStorage<AdminUser[]>(ADMIN_USERS_KEY, []);
           const newAdmins = currentAdmins.filter(admin => admin.email !== email);
           updateAdminStorage(newAdmins);
      }
  };
  
  const updateAdminRole = (email: string, role: AdminRole, categories: string[] = []) => {
    if (isSuperAdmin) {
        const currentAdmins = getFromStorage<AdminUser[]>(ADMIN_USERS_KEY, []);
        const newAdmins = currentAdmins.map(admin => {
            if (admin.email === email) {
                const updatedAdmin: AdminUser = { ...admin, role };
                if (role === 'Normal Admin' && categories.length > 0) {
                    updatedAdmin.managedCategories = categories;
                } else {
                    delete updatedAdmin.managedCategories;
                }
                return updatedAdmin;
            }
            return admin;
        });
        updateAdminStorage(newAdmins);
    }
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
