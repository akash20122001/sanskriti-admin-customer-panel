import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Generate unique order ID
function generateOrderId(): string {
    const randomStr = crypto.randomBytes(5).toString('hex').toUpperCase();
    return `ORD-${randomStr}`;
}



export const orderController = {
    // Get all orders (admin only)
    async getAllOrders(_req: Request, res: Response): Promise<any> {
        try {
            const orders = await prisma.order.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
            });

            res.json({ orders });
        } catch (error) {
            console.error('Get all orders error:', error);
            res.status(500).json({ error: 'Failed to fetch orders' });
        }
    },

    // Get single order by ID (admin only)
    async getOrderById(req: Request, res: Response): Promise<any> {
        try {
            const id = req.params.id as string;

            const order = await prisma.order.findUnique({
                where: { id },
            });

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            res.json({ order });
        } catch (error) {
            console.error('Get order by ID error:', error);
            res.status(500).json({ error: 'Failed to fetch order' });
        }
    },

    // Create new order (admin only)
    async createOrder(req: Request, res: Response): Promise<any> {
        try {
            const { userId, skuId, price, currency, platform, deliveryPartner, trackingId, orderDate } = req.body;

            // Validation
            if (!userId || !skuId || !price || !currency || !platform) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            if (price <= 0) {
                return res.status(400).json({ error: 'Price must be greater than 0' });
            }

            if (!['USD', 'INR'].includes(currency)) {
                return res.status(400).json({ error: 'Invalid currency' });
            }

            // Platform validation removed - now accepts any string value from Settings

            // Generate unique order ID
            const orderId = generateOrderId();

            const order = await prisma.order.create({
                data: {
                    orderId,
                    userId,
                    skuId,
                    price: parseFloat(price),
                    currency,
                    platform,
                    deliveryPartner: deliveryPartner || null,
                    trackingId: trackingId || null,
                    orderDate: orderDate ? new Date(orderDate) : new Date(),
                },
            });

            res.status(201).json({ order });
        } catch (error) {
            console.error('Create order error:', error);
            res.status(500).json({ error: 'Failed to create order' });
        }
    },

    // Update order (admin only)
    async updateOrder(req: Request, res: Response): Promise<any> {
        try {
            const id = req.params.id as string;
            const { userId, skuId, price, currency, platform, status, deliveryPartner, trackingId, orderDate } = req.body;

            // Check if order exists
            const existingOrder = await prisma.order.findUnique({
                where: { id },
            });

            if (!existingOrder) {
                return res.status(404).json({ error: 'Order not found' });
            }

            // Validation
            if (price !== undefined && price <= 0) {
                return res.status(400).json({ error: 'Price must be greater than 0' });
            }

            if (currency && !['USD', 'INR'].includes(currency)) {
                return res.status(400).json({ error: 'Invalid currency' });
            }

            // Platform validation removed - now accepts any string value from Settings

            if (status && !['IN_PROGRESS', 'SHIPPED', 'RTO'].includes(status)) {
                return res.status(400).json({ error: 'Invalid status' });
            }

            // Prepare update data
            const updateData: any = {};
            if (userId !== undefined) updateData.userId = userId;
            if (skuId !== undefined) updateData.skuId = skuId;
            if (price !== undefined) updateData.price = parseFloat(price);
            if (currency !== undefined) updateData.currency = currency;
            if (platform !== undefined) updateData.platform = platform;
            if (status !== undefined) updateData.status = status;
            if (deliveryPartner !== undefined) updateData.deliveryPartner = deliveryPartner || null;
            if (trackingId !== undefined) updateData.trackingId = trackingId || null;
            if (orderDate !== undefined) updateData.orderDate = new Date(orderDate);

            const order = await prisma.order.update({
                where: { id },
                data: updateData,
            });

            res.json({ order });
        } catch (error) {
            console.error('Update order error:', error);
            res.status(500).json({ error: 'Failed to update order' });
        }
    },

    // Delete order (admin only)
    async deleteOrder(req: Request, res: Response): Promise<any> {
        try {
            const id = req.params.id as string;

            const existingOrder = await prisma.order.findUnique({ where: { id } });
            if (!existingOrder) {
                return res.status(404).json({ error: 'Order not found' });
            }

            await prisma.order.delete({ where: { id } });

            res.json({ message: 'Order deleted successfully' });
        } catch (error) {
            console.error('Delete order error:', error);
            res.status(500).json({ error: 'Failed to delete order' });
        }
    },

    // Get customer's orders (customer only - returns their own orders)
    async getCustomerOrders(req: Request, res: Response): Promise<any> {
        try {
            const userId = (req as any).userIdString;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Get orders filtered by customer's userId
            const orders = await prisma.order.findMany({
                where: {
                    userId: userId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            res.json({ orders });
        } catch (error) {
            console.error('Get customer orders error:', error);
            res.status(500).json({ error: 'Failed to fetch orders' });
        }
    },
};
