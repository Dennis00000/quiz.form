const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateTemplate = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('topic')
    .isIn(['Education', 'Quiz', 'Other'])
    .withMessage('Invalid topic'),
  body('questions')
    .isArray({ min: 1 })
    .withMessage('At least one question is required'),
  body('questions.*.title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Question title is required'),
  body('questions.*.type')
    .isIn(['string', 'text', 'number', 'checkbox', 'radio', 'select', 'date', 'email', 'phone', 'url'])
    .withMessage('Invalid question type'),
  handleValidationErrors
];

const validateResponse = [
  body('templateId')
    .isUUID()
    .withMessage('Invalid template ID'),
  body('answers')
    .isObject()
    .withMessage('Answers must be provided'),
  body('emailCopy')
    .optional()
    .isBoolean()
    .withMessage('emailCopy must be a boolean'),
  body('email')
    .if(body('emailCopy').equals('true'))
    .isEmail()
    .withMessage('Valid email is required when requesting email copy'),
  handleValidationErrors
];

module.exports = {
  validateTemplate,
  validateResponse
}; 