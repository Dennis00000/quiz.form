import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import authService from '../services/authService';
import profileService from '../services/profileService';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Set the user from the session
          setUser(session.user);
          setIsAuthenticated(true);
          
          // Fetch the user's profile
          try {
            const userProfile = await profileService.getProfile(session.user.id);
            setProfile(userProfile);
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        setIsAuthenticated(true);
        
        // Fetch the user's profile
        try {
          const userProfile = await profileService.getProfile(session.user.id);
          setProfile(userProfile);
        } catch (profileError) {
          console.error('Error fetching user profile:', profileError);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
      }
    });
    
    // Clean up the listener
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const { user: authUser } = await authService.signIn(email, password);
      
      if (authUser) {
        toast.success('Login successful');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      setIsLoading(true);
      const { user: authUser } = await authService.signUp(email, password, { name });
      
      if (authUser) {
        toast.success('Registration successful');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.signOut();
      toast.success('Logout successful');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (updates) => {
    try {
      setIsLoading(true);
      if (!user) throw new Error('User not authenticated');
      
      const updatedProfile = await profileService.updateProfile(user.id, updates);
      setProfile(updatedProfile);
      toast.success('Profile updated successfully');
      return updatedProfile;
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      setIsLoading(true);
      await authService.resetPassword(email);
      toast.success('Password reset instructions sent to your email');
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update password function
  const updatePassword = async (newPassword) => {
    try {
      setIsLoading(true);
      await authService.updatePassword(newPassword);
      toast.success('Password updated successfully');
      return true;
    } catch (error) {
      console.error('Update password error:', error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    profile,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext; 