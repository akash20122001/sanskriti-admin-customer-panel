import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';

const router = Router();

// Dashboard routes - Admin only
router.get('/admin-stats', authenticateToken, requireAdmin, dashboardController.getAdminStats);

export default router;
