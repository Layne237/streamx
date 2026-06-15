import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getUserStats,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getHistory,
  updateProgress,
  clearHistory,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { validateProgress } from '../middleware/validation.js';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.patch('/profile', authenticate, updateProfile);
router.get('/stats', authenticate, getUserStats);
router.get('/watchlist', authenticate, getWatchlist);
router.post('/watchlist', authenticate, addToWatchlist);
router.delete('/watchlist/:contentId', authenticate, removeFromWatchlist);
router.get('/history', authenticate, getHistory);
router.post('/history/progress', authenticate, validateProgress, updateProgress);
router.delete('/history', authenticate, clearHistory);

export default router;
