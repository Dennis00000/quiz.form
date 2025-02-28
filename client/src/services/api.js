import axios from 'axios';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

// Create a base axios instance
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for authentication
axiosInstance.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = '/login';
    }
    
    // Show toast for network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// API service with both REST and Supabase methods
export const api = {
  // REST API methods
  get: (url, params = {}) => axiosInstance.get(url, { params }),
  post: (url, data = {}) => axiosInstance.post(url, data),
  put: (url, data = {}) => axiosInstance.put(url, data),
  delete: (url) => axiosInstance.delete(url),
  
  // Supabase direct methods
  supabase: {
    // Templates
    getTemplates: async (options = {}) => {
      const { limit = 10, offset = 0, isPublic, sortBy = 'created_at', order = 'desc' } = options;
      
      let query = supabase
        .from('templates')
        .select('*, profiles:user_id(name, avatar_url)')
        .order(sortBy, { ascending: order === 'asc' })
        .limit(limit)
        .range(offset, offset + limit - 1);
        
      if (isPublic !== undefined) {
        query = query.eq('is_public', isPublic);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    
    getTemplate: async (id) => {
      const { data, error } = await supabase
        .from('templates')
        .select('*, profiles:user_id(name, avatar_url), questions(*)')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    },
    
    createTemplate: async (template) => {
      const { data, error } = await supabase
        .from('templates')
        .insert([template])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    
    updateTemplate: async (id, template) => {
      const { data, error } = await supabase
        .from('templates')
        .update(template)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    
    deleteTemplate: async (id) => {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    },
    
    // Questions
    getQuestions: async (templateId) => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('template_id', templateId)
        .order('order_index');
        
      if (error) throw error;
      return data;
    },
    
    // Submissions
    createSubmission: async (submission) => {
      const { data, error } = await supabase
        .from('submissions')
        .insert([submission])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    
    // User profiles
    getProfile: async (userId) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      return data;
    },
    
    updateProfile: async (userId, profile) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', userId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    
    // Search
    searchTemplates: async (query, filters = {}) => {
      let searchQuery = supabase
        .from('templates')
        .select('*, profiles:user_id(name, avatar_url)')
        .order('created_at', { ascending: false });
        
      if (query) {
        searchQuery = searchQuery.textSearch('fts', query);
      }
      
      if (filters.topic) {
        searchQuery = searchQuery.eq('topic', filters.topic);
      }
      
      if (filters.isPublic !== undefined) {
        searchQuery = searchQuery.eq('is_public', filters.isPublic);
      }
      
      const { data, error } = await searchQuery;
      
      if (error) throw error;
      return data;
    }
  }
};

// Export supabase for direct access when needed
export { supabase }; 