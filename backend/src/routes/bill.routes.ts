import { Router } from 'express';
import { billController } from '../controllers/bill.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';

const router = Router();

// Protect all bill routes - admin only
router.use(authenticateToken, requireAdmin);

// Bill routes
router.get('/', billController.getAllBills);
router.get('/:id', billController.getBillById);
router.post('/', billController.createBill);

export default router;
