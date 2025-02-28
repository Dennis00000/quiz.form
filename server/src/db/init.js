const { supabase } = require('../lib/supabase');
const { verifySchema, applyMigration } = require('./verify-schema');
const path = require('path');
const fs = require('fs');

/**
 * Initialize the database with the required schema and seed data
 */
async function initializeDatabase() {
  console.log('Initializing database...');
  
  try {
    // Check if schema is valid
    const schemaValid = await verifySchema();
    
    if (!schemaValid) {
      console.log('Schema needs to be initialized or updated');
      
      // Apply consolidated schema
      const consolidatedSchemaPath = path.join(__dirname, 'migrations', 'consolidated_schema.sql');
      
      if (!fs.existsSync(consolidatedSchemaPath)) {
        console.error('Consolidated schema file not found');
        return false;
      }
      
      const success = await applyMigration(consolidatedSchemaPath);
      
      if (!success) {
        console.error('Failed to apply schema migration');
        return false;
      }
      
      console.log('Schema migration applied successfully');
    }
    
    // Check if we need to seed the database
    const { data: userCount, error: countError } = await supabase
      .from('profiles')
      .select('count');
      
    if (countError) {
      console.error('Error checking user count:', countError);
      return false;
    }
    
    const needsSeed = userCount.length === 0 || userCount[0].count === 0;
    
    if (needsSeed) {
      console.log('Database needs seeding');
      
      // Seed admin user
      const { error: adminError } = await supabase.auth.admin.createUser({
        email: 'admin@example.com',
        password: 'adminpassword',
        user_metadata: { role: 'admin' },
      });
      
      if (adminError) {
        console.error('Error creating admin user:', adminError);
        return false;
      }
      
      console.log('Admin user created');
      
      // Seed categories
      const categories = [
        { name: 'Education', description: 'Educational forms and surveys', slug: 'education' },
        { name: 'Business', description: 'Business and professional forms', slug: 'business' },
        { name: 'Personal', description: 'Personal and lifestyle forms', slug: 'personal' },
        { name: 'Events', description: 'Event planning and feedback forms', slug: 'events' },
        { name: 'Other', description: 'Miscellaneous forms', slug: 'other' }
      ];
      
      const { error: categoriesError } = await supabase
        .from('tags')
        .insert(categories);
        
      if (categoriesError) {
        console.error('Error seeding categories:', categoriesError);
        return false;
      }
      
      console.log('Categories seeded');
    }
    
    console.log('Database initialization complete');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
}

module.exports = {
  initializeDatabase
}; 