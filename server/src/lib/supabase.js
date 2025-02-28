const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

// Create a Supabase client with the service key for server-side operations
const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceKey
);

// Create a Supabase client with the anon key for public operations
const supabasePublic = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

/**
 * Test the Supabase connection
 */
async function testConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection test successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
}

/**
 * Get a public URL for a file in storage
 */
function getPublicUrl(bucket, filePath) {
  if (!bucket || !filePath) return null;
  
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
    
  return data.publicUrl;
}

module.exports = {
  supabase,
  supabasePublic,
  testConnection,
  getPublicUrl
}; 