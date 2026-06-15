import { Router } from 'express';
import { getWatchToken, reportProgress } from '../controllers/watchController.js';
import { authenticate } from '../middleware/auth.js';
import { validateContentId } from '../middleware/validation.js';

const router = Router();

router.get('/token/:id', authenticate, validateContentId, getWatchToken);
router.post('/progress/:id', authenticate, validateContentId, reportProgress);

export default router;
