import { body, param, query, validationResult } from 'express-validator';

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: errors.array() });
  }
  next();
}

export const validateRegister = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('username').trim().isLength({ min: 2, max: 50 }).withMessage('Username must be 2-50 characters'),
  handleValidationErrors,
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

export const validateContentId = [
  param('id').isInt({ min: 1 }).withMessage('Content ID must be a positive integer'),
  handleValidationErrors,
];

export const validateEpisodeId = [
  param('episodeId').isInt({ min: 1 }).withMessage('Episode ID must be a positive integer'),
  handleValidationErrors,
];

export const validatePagination = [
  query('page').optional().isInt({ min: 1 }).toInt().withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('Limit must be 1-100'),
  handleValidationErrors,
];

export const validateReview = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required (max 200 chars)'),
  body('body').trim().isLength({ min: 1, max: 5000 }).withMessage('Body is required (max 5000 chars)'),
  body('rating').optional().isInt({ min: 1, max: 10 }).withMessage('Rating must be 1-10'),
  handleValidationErrors,
];

export const validateProgress = [
  body('position_seconds').isInt({ min: 0 }).withMessage('position_seconds must be >= 0'),
  body('duration_watched_seconds').isInt({ min: 0 }).withMessage('duration_watched_seconds must be >= 0'),
  body('completed').optional().isBoolean().withMessage('completed must be boolean'),
  handleValidationErrors,
];
