const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// Get user profile
router.get('/profile', auth, userController.getProfile);

// Update user profile
router.put('/profile', [
  auth,
  body('name').trim().notEmpty(),
  body('email').isEmail(),
], userController.updateProfile);

// Change password
router.put('/password', [
  auth,
  body('currentPassword').exists(),
  body('newPassword').isLength({ min: 8 }),
], userController.changePassword);

// Get user's templates
router.get('/templates', auth, userController.getUserTemplates);

// Get user's responses
router.get('/responses', auth, userController.getUserResponses);

module.exports = router; 