import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Generate unique order ID
function generateOrderId(): string {
    const randomStr = crypto.randomBytes(5).toString('hex').toUpperCase();
    return `ORD-${randomStr}`;
}

// Generate unique transaction ID
function generateTransactionId(): string {
    const uuid = crypto.randomUUID();
    const timestamp = Date.now().toString(36);
    const randomPart = uuid.split('-')[0].toUpperCase();
    return `TXN-${timestamp}-${randomPart}`;
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

            // CRITICAL FIX: Check if user exists
            const user = await prisma.user.findUnique({ where: { userId } });
            if (!user) {
                return res.status(404).json({ error: `User with ID '${userId}' not found` });
            }

            // CRITICAL FIX: Check if user has sufficient wallet balance
            // Wallet balance check removed as per requirement
            /*
            const orderPrice = parseFloat(price);
            if (user.walletBalance < orderPrice) {
                return res.status(400).json({
                    error: `Insufficient wallet balance. User has ₹${user.walletBalance.toFixed(2)} but needs ₹${orderPrice.toFixed(2)}`
                });
            }
            */
            const orderPrice = parseFloat(price);

            // Generate unique order ID
            const orderId = generateOrderId();

            const order = await prisma.order.create({
                data: {
                    orderId,
                    userId,
                    skuId,
                    price: orderPrice,
                    currency,
                    platform,
                    deliveryPartner: deliveryPartner || null,
                    trackingId: trackingId || null,
                    orderDate: orderDate ? new Date(orderDate) : new Date(),
                },
            });

            // Deduct from wallet & Create Transaction
            const transactionId = generateTransactionId();

            await prisma.transaction.create({
                data: {
                    transactionId,
                    userId: user.userId,
                    amount: orderPrice,
                    type: 'DEBIT',
                    status: 'SUCCESS',
                    paymentMethod: 'WALLET',
                    description: `Order payment for ${skuId} (Ord: ${orderId})`,
                },
            });

            await prisma.user.update({
                where: { userId: user.userId },
                data: { walletBalance: user.walletBalance - orderPrice },
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
