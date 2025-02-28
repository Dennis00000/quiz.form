import { supabase } from '../lib/supabase';
import { handleSupabaseError } from '../utils/errorHandler';

/**
 * Service for authentication-related API calls
 */
const authService = {
  /**
   * Sign up a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Object} metadata - Additional user metadata
   * @returns {Promise<Object>} - User data
   */
  async signUp(email, password, metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Create a profile for the new user
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: metadata.name || email.split('@')[0],
            email: email,
            created_at: new Date().toISOString()
          });
        
        if (profileError) {
          console.error('Failed to create user profile:', profileError);
          // Continue anyway, as the auth record was created
        }
      }
      
      return data;
    } catch (error) {
      handleSupabaseError(error, 'Failed to sign up');
      throw error;
    }
  },
  
  /**
   * Sign in a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User data
   */
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      handleSupabaseError(error, 'Failed to sign in');
      throw error;
    }
  },
  
  /**
   * Sign out the current user
   * @returns {Promise<void>}
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
    } catch (error) {
      handleSupabaseError(error, 'Failed to sign out');
      throw error;
    }
  },
  
  /**
   * Get the current user
   * @returns {Promise<Object>} - User data
   */
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        throw error;
      }
      
      return data.user;
    } catch (error) {
      handleSupabaseError(error, 'Failed to get current user', true);
      return null;
    }
  },
  
  /**
   * Reset a user's password
   * @param {string} email - User email
   * @returns {Promise<boolean>} - Success status
   */
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      handleSupabaseError(error, 'Failed to send password reset email');
      throw error;
    }
  },
  
  /**
   * Update a user's password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} - User data
   */
  async updatePassword(newPassword) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      handleSupabaseError(error, 'Failed to update password');
      throw error;
    }
  }
};

export default authService; 