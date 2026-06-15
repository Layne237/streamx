import { Router } from 'express';
import {
  getCatalog,
  getFeatured,
  getTrending,
  getContentById,
  getEpisodes,
  searchContent,
} from '../controllers/contentController.js';
import { optionalAuth } from '../middleware/auth.js';
import { validateContentId, validatePagination } from '../middleware/validation.js';

const router = Router();

router.get('/catalog', validatePagination, getCatalog);
router.get('/featured', getFeatured);
router.get('/trending', validatePagination, getTrending);
router.get('/search', validatePagination, searchContent);
router.get('/:id', validateContentId, optionalAuth, getContentById);
router.get('/:id/episodes', validateContentId, getEpisodes);

export default router;
