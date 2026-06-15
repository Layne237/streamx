import { Router } from 'express';
import {
  getDashboard,
  getUsers,
  updateUser,
  deleteUser,
  moderateReview,
  getDMCA,
} from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validatePagination } from '../middleware/validation.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard', getDashboard);
router.get('/users', validatePagination, getUsers);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/reviews/:id/moderate', moderateReview);
router.get('/dmca', validatePagination, getDMCA);

export default router;
