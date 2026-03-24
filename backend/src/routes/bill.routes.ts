import { Router } from 'express';
import { billController } from '../controllers/bill.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';

const router = Router();

// Customer routes (authenticated users can see their own bills)
router.get('/customer/my-bills', authenticateToken, billController.getCustomerBills);

// Protect all other bill routes - admin only
router.use(authenticateToken, requireAdmin);

// Admin bill routes
router.get('/', billController.getAllBills);
router.get('/:id', billController.getBillById);
router.post('/', billController.createBill);
router.delete('/:id', billController.deleteBill);

export default router;
