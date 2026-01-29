import express from 'express';
import { transactionController } from '../controllers/transaction.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';

const router = express.Router();

// Customer routes (authenticated users)
router.get('/', authenticateToken, transactionController.getTransactions);
router.post('/create-test-order', authenticateToken, transactionController.createTestOrder);
router.post('/verify-test-payment', authenticateToken, transactionController.verifyTestPayment);

// Admin routes
router.post('/admin-credit', authenticateToken, requireAdmin, transactionController.adminCredit);

export default router;
