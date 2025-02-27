require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { connect: connectCache } = require('./services/cacheService');
const setupDatabase = require('./config/setupDatabase');

const app = express();
const PORT = process.env.PORT || 3002;

// Basic middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Debug logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Basic test routes
app.get('/', (req, res) => {
  res.send('Server is running');
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

// API routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Initialize cache
connectCache();

// Setup database before starting server
setupDatabase()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

    // Error handling for server
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is busy, trying ${PORT + 1}...`);
        server.listen(PORT + 1);
      } else {
        console.error('Server error:', err);
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      server.close(() => {
        console.log('Server shut down gracefully');
      });
    });
  })
  .catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });