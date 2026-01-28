import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

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
            const { userId, skuId, price, currency, platform } = req.body;

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

            if (!['Amazon', 'Flipkart', 'Meesho', 'Etsy'].includes(platform)) {
                return res.status(400).json({ error: 'Invalid platform' });
            }

            // Generate unique order ID
            const orderId = `ORD-${nanoid(10).toUpperCase()}`;

            const order = await prisma.order.create({
                data: {
                    orderId,
                    userId,
                    skuId,
                    price: parseFloat(price),
                    currency,
                    platform,
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
            const { userId, skuId, price, currency, platform } = req.body;

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

            if (platform && !['Amazon', 'Flipkart', 'Meesho', 'Etsy'].includes(platform)) {
                return res.status(400).json({ error: 'Invalid platform' });
            }

            // Prepare update data
            const updateData: any = {};
            if (userId !== undefined) updateData.userId = userId;
            if (skuId !== undefined) updateData.skuId = skuId;
            if (price !== undefined) updateData.price = parseFloat(price);
            if (currency !== undefined) updateData.currency = currency;
            if (platform !== undefined) updateData.platform = platform;

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
};
