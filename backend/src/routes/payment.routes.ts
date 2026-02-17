import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateWebhookSignature } from '../middleware/validateWebhook';

const router = Router();

/**
 * @route   POST /api/payment/create-order
 * @desc    Create Razorpay order for wallet top-up
 * @access  Private (Customer/Admin)
 */
router.post('/create-order', authenticateToken, paymentController.createOrder);

/**
 * @route   POST /api/payment/verify
 * @desc    Verify Razorpay payment signature and credit wallet
 * @access  Private (Customer/Admin)
 */
router.post('/verify', authenticateToken, paymentController.verifyPayment);

/**
 * @route   POST /api/payment/webhook
 * @desc    Handle Razorpay webhooks (payment success/failure)
 * @access  Public (but signature validated)
 * @note    This endpoint should be configured in Razorpay Dashboard
 */
router.post('/webhook', validateWebhookSignature, paymentController.handleWebhook);

export default router;
