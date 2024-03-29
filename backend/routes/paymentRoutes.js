import express from 'express';
import isUserAuthenticated from '../middlewares/auth.js';
import { stripeCheckoutSession, stripeWebHook } from '../controllers/paymentControllers.js';

const router = express.Router();

router.route('/payment/checkout_session').post(isUserAuthenticated, stripeCheckoutSession);
router.route('/payment/webhook').post(stripeWebHook);

export default router;
