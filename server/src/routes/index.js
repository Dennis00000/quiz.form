const express = require('express');
const router = express.Router();

// Import route modules
const templateRoutes = require('./templates');
const userRoutes = require('./users');
const authRoutes = require('./auth');
const testRoutes = require('./test');
const templatesMinimalRoutes = require('./templates-minimal');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Register routes
router.use('/templates', templateRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/test', testRoutes);
router.use('/templates-minimal', templatesMinimalRoutes);
// Register other routes as needed

module.exports = router;