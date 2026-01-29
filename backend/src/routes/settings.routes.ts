import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Only ADMIN can access settings
router.get('/', authenticate, authorize(['ADMIN']), settingsController.getSettings);
router.put('/', authenticate, authorize(['ADMIN']), settingsController.updateSettings);

export default router;
