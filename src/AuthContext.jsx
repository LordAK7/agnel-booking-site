import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext();

// Check if Supabase credentials are available
const isMissingCredentials = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [envError, setEnvError] = useState(isMissingCredentials);

  useEffect(() => {
    // Only attempt to get session if credentials are available
    if (isMissingCredentials) {
      console.error('Missing Supabase credentials. Please check your environment variables.');
      setLoading(false);
      return;
    }

    // Check for active session on mount
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data?.session?.user || null);
      } catch (error) {
        console.error('Error getting auth session:', error);
      } finally {
        setLoading(false);
      }
      
      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user || null);
        }
      );
      
      return () => {
        authListener?.subscription?.unsubscribe();
      };
    };
    
    getSession();
  }, []);

  const value = {
    user,
    loading,
    envError,
    signIn: (email, password) => {
      if (isMissingCredentials) return Promise.reject(new Error('API credentials not configured'));
      return supabase.auth.signInWithPassword({ email, password });
    },
    signUp: (email, password, options) => {
      if (isMissingCredentials) return Promise.reject(new Error('API credentials not configured'));
      return supabase.auth.signUp({ email, password, options });
    },
    signOut: () => {
      if (isMissingCredentials) return Promise.resolve();
      return supabase.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
