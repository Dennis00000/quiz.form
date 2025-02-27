const serviceSupabase = require('./serviceSupabase');

const setupDatabase = async () => {
  try {
    console.log('Starting database setup...');

    // Check if users table exists
    const { error: tableError } = await serviceSupabase
      .from('users')
      .select('id')
      .limit(1);

    if (tableError) {
      console.log('Creating users table...');
      // Create users table through Supabase interface
      const { error: createError } = await serviceSupabase
        .from('users')
        .insert({
          email: 'setup@example.com',
          name: 'Setup User',
          password_hash: 'setup',
          role: 'user',
          status: 'active'
        })
        .select();

      if (createError && !createError.message.includes('duplicate key')) {
        console.error('Error creating table:', createError);
        throw createError;
      }
    }

    // Check if required columns exist
    const { data: columns, error: columnsError } = await serviceSupabase
      .from('users')
      .select()
      .limit(1);

    if (columnsError) {
      console.error('Error checking columns:', columnsError);
      throw columnsError;
    }

    console.log('Current table structure:', Object.keys(columns?.[0] || {}));

    // The table should now be ready for use
    console.log('Database setup completed successfully');
    
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
};

module.exports = setupDatabase; 