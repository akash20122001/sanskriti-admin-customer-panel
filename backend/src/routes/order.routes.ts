import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// All order routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Order routes
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);

export default router;
