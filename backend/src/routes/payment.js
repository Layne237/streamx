import { Router } from 'express';
import {
  getPlans,
  createCheckoutSession,
  handleWebhook,
  getBillingPortal,
  cancelSubscription,
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/plans', getPlans);
router.post('/checkout', authenticate, createCheckoutSession);
router.post('/webhook', handleWebhook);
router.get('/portal', authenticate, getBillingPortal);
router.post('/cancel', authenticate, cancelSubscription);

export default router;
