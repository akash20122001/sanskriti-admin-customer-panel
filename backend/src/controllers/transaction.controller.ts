import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Generate unique transaction ID
function generateTransactionId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `TXN-${timestamp}-${randomPart}`;
}

export const transactionController = {
    // Get user's transactions (customer)
    async getTransactions(req: Request, res: Response): Promise<any> {
        try {
            const user = (req as any).user;

            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Customer can only see their own transactions
            let whereClause: any = {};

            if (user.role === 'CUSTOMER') {
                // Find user by userId field
                const userData = await prisma.user.findUnique({
                    where: { userId: user.userId }
                });

                if (!userData) {
                    return res.status(404).json({ error: 'User not found' });
                }

                whereClause = { userId: userData.userId };
            }
            // Admin can see all transactions (no filter)

            const transactions = await prisma.transaction.findMany({
                where: whereClause,
                orderBy: {
                    createdAt: 'desc',
                },
            });

            res.json({ transactions });
        } catch (error) {
            console.error('Get transactions error:', error);
            res.status(500).json({ error: 'Failed to fetch transactions' });
        }
    },

    // Create test payment order (simulates payment gateway)
    async createTestOrder(req: Request, res: Response): Promise<any> {
        try {
            const user = (req as any).user;
            const { amount } = req.body;

            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Validation
            if (!amount || amount <= 0) {
                return res.status(400).json({ error: 'Amount must be greater than 0' });
            }

            if (amount < 100) {
                return res.status(400).json({ error: 'Minimum amount is ₹100' });
            }

            if (amount > 50000) {
                return res.status(400).json({ error: 'Maximum amount is ₹50,000' });
            }

            // Find user by userId
            const userData = await prisma.user.findUnique({
                where: { userId: user.userId }
            });

            if (!userData) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Generate transaction ID
            const transactionId = generateTransactionId();

            // Create pending transaction
            const transaction = await prisma.transaction.create({
                data: {
                    transactionId,
                    userId: userData.userId,
                    amount: parseFloat(amount),
                    type: 'CREDIT',
                    status: 'PENDING',
                    paymentMethod: 'TEST_PAYMENT',
                    description: `Wallet top-up of ₹${amount}`,
                },
            });

            // Return order details for frontend
            res.status(201).json({
                transactionId: transaction.transactionId,
                amount: transaction.amount,
                message: 'Test payment order created',
            });
        } catch (error) {
            console.error('Create test order error:', error);
            res.status(500).json({ error: 'Failed to create payment order' });
        }
    },

    // Verify test payment (simulates payment verification)
    async verifyTestPayment(req: Request, res: Response): Promise<any> {
        try {
            const user = (req as any).user;
            const { transactionId, success } = req.body;

            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            if (!transactionId) {
                return res.status(400).json({ error: 'Transaction ID is required' });
            }

            // Find transaction
            const transaction = await prisma.transaction.findUnique({
                where: { transactionId },
            });

            if (!transaction) {
                return res.status(404).json({ error: 'Transaction not found' });
            }

            // Verify user owns this transaction
            if (transaction.userId !== user.userId) {
                return res.status(403).json({ error: 'Unauthorized access to transaction' });
            }

            if (transaction.status !== 'PENDING') {
                return res.status(400).json({ error: 'Transaction already processed' });
            }

            // Update transaction status
            const newStatus = success ? 'SUCCESS' : 'FAILED';

            const updatedTransaction = await prisma.transaction.update({
                where: { transactionId },
                data: { status: newStatus },
            });

            // If successful, update user wallet balance
            if (success) {
                const userData = await prisma.user.findUnique({
                    where: { userId: transaction.userId }
                });

                if (userData) {
                    await prisma.user.update({
                        where: { userId: transaction.userId },
                        data: {
                            walletBalance: userData.walletBalance + transaction.amount,
                        },
                    });
                }
            }

            res.json({
                transaction: updatedTransaction,
                message: success ? 'Payment successful' : 'Payment failed',
            });
        } catch (error) {
            console.error('Verify payment error:', error);
            res.status(500).json({ error: 'Failed to verify payment' });
        }
    },

    // Admin: Manual credit to user wallet
    async adminCredit(req: Request, res: Response): Promise<any> {
        try {
            const { userId, amount, description } = req.body;

            // Validation
            if (!userId || !amount) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            if (amount <= 0) {
                return res.status(400).json({ error: 'Amount must be greater than 0' });
            }

            // Find user
            const user = await prisma.user.findUnique({
                where: { userId },
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Generate transaction ID
            const transactionId = generateTransactionId();

            // Create successful transaction
            const transaction = await prisma.transaction.create({
                data: {
                    transactionId,
                    userId: user.userId,
                    amount: parseFloat(amount),
                    type: 'CREDIT',
                    status: 'SUCCESS',
                    paymentMethod: 'ADMIN_CREDIT',
                    description: description || `Admin credit of ₹${amount}`,
                },
            });

            // Update user wallet balance
            await prisma.user.update({
                where: { userId },
                data: {
                    walletBalance: user.walletBalance + parseFloat(amount),
                },
            });

            res.status(201).json({ transaction, message: 'Credit successful' });
        } catch (error) {
            console.error('Admin credit error:', error);
            res.status(500).json({ error: 'Failed to credit wallet' });
        }
    },
};
