import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { ApiService } from '../services/api';
import { StorageService } from '../services/storage';
import { supabase } from '../services/supabase';

interface AuthContextType {
  currentUser: User | null;
  allUsers: User[];
  isLoading: boolean;
  login: (email: string) => Promise<User>;
  loginWithSupabase: (email: string, password: string) => Promise<User>;
  signUpWithSupabase: (email: string, password: string, name: string, role: UserRole) => Promise<User>;
  loginWithMagicLink: (email: string) => Promise<{ success: boolean; message: string }>;
  register: (data: Partial<User> & { email: string; name: string; role: UserRole }) => Promise<User>;
  logout: () => Promise<void>;
  switchUser: (userId: string) => Promise<User>;
  switchRoleQuick: (role: UserRole) => Promise<User>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
  refreshUsers: () => Promise<void>;
  resetDatabase: () => void;
  supabaseConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(true);

  const initAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      ApiService.init();
      const users = await ApiService.getAllUsers();
      const current = await ApiService.getCurrentUser();
      setAllUsers(users);
      setCurrentUser(current);

      // Check active Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const matching = users.find(u => u.email.toLowerCase() === session.user.email?.toLowerCase());
        if (matching) {
          setCurrentUser(matching);
        }
      }
    } catch (e) {
      console.error('Failed to init auth', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();

    // Listen to Supabase Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email) {
        const users = await ApiService.getAllUsers();
        const found = users.find(u => u.email.toLowerCase() === session.user.email?.toLowerCase());
        if (found) {
          setCurrentUser(found);
          ApiService.switchUser(found.id);
        }
      } else if (event === 'SIGNED_OUT') {
        // Handled in logout
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initAuth]);

  const login = async (email: string): Promise<User> => {
    setIsLoading(true);
    try {
      const user = await ApiService.login(email);
      setCurrentUser(user);
      const users = await ApiService.getAllUsers();
      setAllUsers(users);
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSupabase = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // If Supabase credentials fail (e.g. unconfirmed email or demo mode), fallback to local registry
        console.warn('Supabase auth notice:', error.message);
        const user = await ApiService.login(email);
        setCurrentUser(user);
        return user;
      }

      if (data.user) {
        const users = await ApiService.getAllUsers();
        let matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!matched) {
          matched = await ApiService.registerUser({
            email,
            name: data.user.user_metadata?.name || email.split('@')[0],
            role: (data.user.user_metadata?.role as UserRole) || 'customer'
          });
        }
        setCurrentUser(matched);
        return matched;
      }

      throw new Error('Supabase sign-in was unsuccessful.');
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithSupabase = async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ): Promise<User> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role }
        }
      });

      if (error) {
        console.warn('Supabase signup notice:', error.message);
      }

      // Register into application state
      const user = await ApiService.registerUser({ email, name, role });
      setCurrentUser(user);
      const users = await ApiService.getAllUsers();
      setAllUsers(users);
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithMagicLink = async (email: string): Promise<{ success: boolean; message: string }> => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: `A secure Supabase magic link has been sent to ${email}. Check your inbox!`
    };
  };

  const register = async (data: Partial<User> & { email: string; name: string; role: UserRole }): Promise<User> => {
    setIsLoading(true);
    try {
      const user = await ApiService.registerUser(data);
      setCurrentUser(user);
      const users = await ApiService.getAllUsers();
      setAllUsers(users);
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut notice:', e);
    }
    // Default to first customer demo
    const firstCust = allUsers.find(u => u.role === 'customer') || allUsers[0];
    if (firstCust) {
      ApiService.switchUser(firstCust.id);
      setCurrentUser(firstCust);
    }
  };

  const switchUser = async (userId: string): Promise<User> => {
    setIsLoading(true);
    try {
      const user = await ApiService.switchUser(userId);
      setCurrentUser(user);
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const switchRoleQuick = async (role: UserRole): Promise<User> => {
    const target = allUsers.find(u => u.role === role);
    if (target) {
      return switchUser(target.id);
    }
    throw new Error(`No demo persona found for role: ${role}`);
  };

  const updateProfile = async (updates: Partial<User>): Promise<User> => {
    if (!currentUser) throw new Error('No user logged in');
    const updated = await ApiService.updateProfile(currentUser.id, updates);
    setCurrentUser(updated);
    const users = await ApiService.getAllUsers();
    setAllUsers(users);
    return updated;
  };

  const refreshUsers = async (): Promise<void> => {
    const users = await ApiService.getAllUsers();
    setAllUsers(users);
    if (currentUser) {
      const freshCurrent = users.find(u => u.id === currentUser.id);
      if (freshCurrent) setCurrentUser(freshCurrent);
    }
  };

  const resetDatabase = () => {
    StorageService.resetData();
    initAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        isLoading,
        login,
        loginWithSupabase,
        signUpWithSupabase,
        loginWithMagicLink,
        register,
        logout,
        switchUser,
        switchRoleQuick,
        updateProfile,
        refreshUsers,
        resetDatabase,
        supabaseConnected
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
