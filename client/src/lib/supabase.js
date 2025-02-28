import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get a public URL for a file in storage
 * @param {string} bucket - Storage bucket name
 * @param {string} filePath - Path to the file
 * @returns {string|null} - Public URL or null
 */
export const getPublicUrl = (bucket, filePath) => {
  if (!bucket || !filePath) return null;
  
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
    
  return data.publicUrl;
};

/**
 * Upload a file to storage
 * @param {string} bucket - Storage bucket name
 * @param {string} path - Path to store the file
 * @param {File} file - File to upload
 * @returns {Promise<Object>} - Upload result
 */
export const uploadFile = async (bucket, path, file) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    throw error;
  }
  
  return {
    ...data,
    publicUrl: getPublicUrl(bucket, data.path)
  };
};

/**
 * Delete a file from storage
 * @param {string} bucket - Storage bucket name
 * @param {string} path - Path to the file
 * @returns {Promise<boolean>} - Success status
 */
export const deleteFile = async (bucket, path) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  
  if (error) {
    throw error;
  }
  
  return true;
};

export default supabase; 