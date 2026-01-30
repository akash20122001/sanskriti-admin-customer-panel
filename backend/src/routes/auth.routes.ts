import { Router } from 'express';
import { login, register, me, emergencyFix } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticateToken, me);
router.get('/emergency-fix', emergencyFix);

export default router;
