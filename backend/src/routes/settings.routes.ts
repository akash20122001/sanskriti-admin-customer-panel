import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Only ADMIN can access settings
router.get('/', authenticateToken, requireAdmin, settingsController.getSettings);
router.put('/', authenticateToken, requireAdmin, settingsController.updateSettings);

export default router;
