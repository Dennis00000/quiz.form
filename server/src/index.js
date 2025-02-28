require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const { connect: connectCache } = require('./services/cacheService');
const setupDatabase = require('./config/setupDatabase');
const { initializeDatabase } = require('./db/init');
const { testConnection } = require('./lib/supabase');
const { supabase } = require('./config/supabase');

const app = express();
const PORT = process.env.PORT || 3002;

// Comment out compression if you don't want to install it
// app.use(compression());

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors(config.cors));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Comment out morgan if you don't want to install it
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));

// Debug logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Basic test routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the QuizForm API' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Add this before your routes
app.get('/api/bypass-test', (req, res) => {
  console.log('Headers:', req.headers);
  res.json({ 
    message: 'Bypass test successful',
    authHeader: req.header('Authorization')
  });
});

// Add this before the API routes section
app.get('/direct-test', (req, res) => {
  res.json({ message: 'Direct test route works!' });
});

app.get('/direct-auth-test', (req, res) => {
  console.log('All headers:', req.headers);
  const authHeader = req.header('Authorization');
  console.log('Auth header in direct route:', authHeader);
  
  try {
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided', headers: req.headers });
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log('Extracted token:', token.substring(0, 20) + '...');
    
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    res.json({
      message: 'Direct auth test works!',
      user: decoded
    });
  } catch (error) {
    console.error('Direct auth test error:', error);
    res.status(401).json({ error: 'Invalid token', errorDetails: error.message });
  }
});

// Import all route modules
const authRoutes = require('./routes/auth');
const templateRoutes = require('./routes/templates');
const searchRoutes = require('./routes/search');
const adminRoutes = require('./routes/admin');
const homeRoutes = require('./routes/home');
const userRoutes = require('./routes/users');
const exportRoutes = require('./routes/export');
const tagRoutes = require('./routes/tags');
const uploadRoutes = require('./routes/upload');
const languageRoutes = require('./routes/language');
const testRoutes = require('./routes/test');
const simpleRoutes = require('./routes/simple');
const submissionRoutes = require('./routes/submissions');

// Register all routes
app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/language', languageRoutes);
app.use('/api/test', testRoutes);
app.use('/api/simple', simpleRoutes);
app.use('/api/submissions', submissionRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use(errorHandler);

// Initialize cache
connectCache();

// Test Supabase connection
async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('count');
    
    if (error && error.code !== 'PGRST116') {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    console.log('Supabase service connection test successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
}

// Start the server
async function startServer() {
  try {
    // Test Supabase connection
    const connectionOk = await testConnection();
    if (!connectionOk) {
      console.error('Failed to connect to Supabase. Exiting...');
      process.exit(1);
    }
    
    // Initialize database
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      console.error('Failed to initialize database. Exiting...');
      process.exit(1);
    }
    
    // Start the server
    app.listen(config.port, () => {
      console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
    });
  } catch (error) {
    console.error('Server initialization error:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Start the server
startServer();