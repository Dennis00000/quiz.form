const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authLimiter } = require('../middleware/security');
const authController = require('../controllers/authController');

// Debug middleware
router.use((req, res, next) => {
  console.log('Auth route hit:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers
  });
  next();
});

// Registration route
router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty()
], authController.register);

// Login route
router.post('/login', authLimiter, [
  body('email').isEmail(),
  body('password').exists()
], authController.login);

module.exports = router; 