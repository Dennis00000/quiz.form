/**
 * Centralized configuration for the server
 */
require('dotenv').config();

const config = {
  // Server settings
  port: process.env.PORT || 3002,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-should-be-in-env',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  // Supabase settings
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
    anonKey: process.env.SUPABASE_ANON_KEY,
  },
  
  // Email settings
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || 'noreply@quizform.com',
  },
  
  // Storage settings
  storage: {
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
  },
  
  // CORS settings
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
};

module.exports = config; 