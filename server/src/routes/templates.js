const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const templateController = require('../controllers/templateController');

// Public routes
router.get('/', templateController.getAllTemplates);
router.get('/:id', templateController.getTemplate);

// Protected routes (require authentication)
router.use(auth);

// User routes
router.post('/', [
  body('title').trim().isLength({ min: 3, max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('topic').isIn(['Education', 'Quiz', 'Other']),
  body('questions').isArray({ min: 1, max: 16 }),
  body('questions.*.title').trim().isLength({ min: 3, max: 200 }),
  body('questions.*.type').isIn(['string', 'text', 'number', 'checkbox', 'radio', 'select', 'date', 'email', 'phone', 'url']),
], templateController.createTemplate);
router.put('/:id', templateController.updateTemplate);
router.delete('/:id', templateController.deleteTemplate);

// Admin only routes
router.post('/approve/:id', 
  checkRole(['admin']), 
  templateController.approveTemplate
);

// Submit response
router.post('/:id/responses', templateController.submitResponse);

// Get template responses
router.get('/:id/responses', templateController.getResponses);

// Like/unlike template
router.post('/:id/like', templateController.toggleLike);

// Add comment
router.post('/:id/comments', [
  body('content').trim().notEmpty()
], templateController.addComment);

// Delete comment
router.delete('/:id/comments/:commentId', templateController.deleteComment);

module.exports = router; 