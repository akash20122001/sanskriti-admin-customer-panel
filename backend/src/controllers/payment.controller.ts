import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { razorpayInstance, RAZORPAY_CONFIG } from '../config/razorpay.config';

const prisma = new PrismaClient();

// Generate unique transaction ID
function generateTransactionId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `TXN-${timestamp}-${randomPart}`;
}

export const paymentController = {
    /**
     * Create Razorpay order for wallet top-up
     * Step 1 of payment flow
     */
    async createOrder(req: Request, res: Response): Promise<any> {
        try {
            const userId = (req as any).userIdString;
            const { amount } = req.body;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Validation
            if (!amount || typeof amount !== 'number') {
                return res.status(400).json({ error: 'Valid amount is required' });
            }

            if (amount < RAZORPAY_CONFIG.MIN_AMOUNT) {
                return res.status(400).json({
                    error: `Minimum amount is ₹${RAZORPAY_CONFIG.MIN_AMOUNT}`
                });
            }

            if (amount > RAZORPAY_CONFIG.MAX_AMOUNT) {
                return res.status(400).json({
                    error: `Maximum amount is ₹${RAZORPAY_CONFIG.MAX_AMOUNT}`
                });
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

            // Create Razorpay order
            // Amount must be in paise (multiply by 100)
            const razorpayOrder = await razorpayInstance.orders.create({
                amount: amount * 100, // Convert to paise
                currency: RAZORPAY_CONFIG.CURRENCY,
                receipt: transactionId,
                notes: {
                    userId: user.userId,
                    userName: user.name,
                    purpose: 'Wallet Top-up',
                },
            });

            // Create pending transaction in database
            const transaction = await prisma.transaction.create({
                data: {
                    transactionId,
                    userId: user.userId,
                    amount: amount,
                    type: 'CREDIT',
                    status: 'PENDING',
                    paymentMethod: 'RAZORPAY',
                    description: `Wallet top-up of ₹${amount}`,
                },
            });

            // Return order details for frontend
            res.status(201).json({
                orderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                transactionId: transaction.transactionId,
                keyId: RAZORPAY_CONFIG.KEY_ID, // Public key for frontend
            });
        } catch (error) {
            console.error('Create Razorpay order error:', error);
            res.status(500).json({
                error: 'Failed to create payment order',
                details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
            });
        }
    },

    /**
     * Verify Razorpay payment signature
     * Step 2 of payment flow - Called after user completes payment
     */
    async verifyPayment(req: Request, res: Response): Promise<any> {
        try {
            const userId = (req as any).userIdString;
            const {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                transactionId
            } = req.body;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Validation
            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !transactionId) {
                return res.status(400).json({ error: 'Missing payment details' });
            }

            // Find transaction
            const transaction = await prisma.transaction.findUnique({
                where: { transactionId },
            });

            if (!transaction) {
                return res.status(404).json({ error: 'Transaction not found' });
            }

            // Verify user owns this transaction
            if (transaction.userId !== userId) {
                return res.status(403).json({ error: 'Unauthorized access to transaction' });
            }

            // Check if already processed
            if (transaction.status !== 'PENDING') {
                return res.status(400).json({
                    error: 'Transaction already processed',
                    status: transaction.status
                });
            }

            // Verify signature
            const generatedSignature = crypto
                .createHmac('sha256', RAZORPAY_CONFIG.KEY_SECRET)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest('hex');

            if (generatedSignature !== razorpay_signature) {
                // Invalid signature - mark transaction as failed
                await prisma.transaction.update({
                    where: { transactionId },
                    data: {
                        status: 'FAILED',
                        description: `${transaction.description} - Payment verification failed`
                    },
                });

                return res.status(400).json({ error: 'Payment verification failed' });
            }

            // Signature is valid - update transaction and wallet balance
            const [updatedTransaction, user] = await prisma.$transaction(async (tx) => {
                // Update transaction status
                const txn = await tx.transaction.update({
                    where: { transactionId },
                    data: {
                        status: 'SUCCESS',
                        description: `${transaction.description} - Payment ID: ${razorpay_payment_id}`
                    },
                });

                // Get current user data
                const currentUser = await tx.user.findUnique({
                    where: { userId: transaction.userId },
                });

                if (!currentUser) {
                    throw new Error('User not found');
                }

                // Update wallet balance
                const updatedUser = await tx.user.update({
                    where: { userId: transaction.userId },
                    data: {
                        walletBalance: currentUser.walletBalance + transaction.amount,
                    },
                });

                return [txn, updatedUser];
            });

            console.log(`✅ Payment successful: ${razorpay_payment_id} - ₹${transaction.amount} added to ${user.userId}`);

            res.json({
                success: true,
                transaction: updatedTransaction,
                newBalance: user.walletBalance,
                message: 'Payment successful! Your wallet has been credited.',
            });
        } catch (error) {
            console.error('Verify payment error:', error);
            res.status(500).json({
                error: 'Failed to verify payment',
                details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
            });
        }
    },

    /**
     * Handle Razorpay webhooks
     * Backup verification and handling edge cases
     */
    async handleWebhook(req: Request, res: Response): Promise<any> {
        try {
            const event = req.body;

            console.log('📥 Webhook received:', event.event);

            // Handle different webhook events
            switch (event.event) {
                case 'payment.captured':
                    await handlePaymentCaptured(event.payload.payment.entity);
                    break;

                case 'payment.failed':
                    await handlePaymentFailed(event.payload.payment.entity);
                    break;

                case 'order.paid':
                    console.log('Order paid event received');
                    break;

                default:
                    console.log(`Unhandled webhook event: ${event.event}`);
            }

            // Always respond with 200 to acknowledge receipt
            res.status(200).json({ status: 'ok' });
        } catch (error) {
            console.error('Webhook handler error:', error);
            // Still return 200 to prevent Razorpay from retrying
            res.status(200).json({ status: 'error' });
        }
    },
};

/**
 * Handle successful payment webhook
 */
async function handlePaymentCaptured(payment: any): Promise<void> {
    try {
        const receipt = payment.order_id; // This should be our transactionId
        const razorpayPaymentId = payment.id;
        const amount = payment.amount / 100; // Convert from paise to rupees

        console.log(`💰 Payment captured: ${razorpayPaymentId} - ₹${amount}`);

        // Find transaction by receipt (which is our transactionId)
        const transaction = await prisma.transaction.findFirst({
            where: {
                transactionId: receipt,
                status: 'PENDING',
            },
        });

        if (!transaction) {
            console.log(`Transaction not found or already processed: ${receipt}`);
            return;
        }

        // Verify amount matches
        if (transaction.amount !== amount) {
            console.error(`Amount mismatch! Expected: ${transaction.amount}, Got: ${amount}`);
            await prisma.transaction.update({
                where: { transactionId: receipt },
                data: {
                    status: 'FAILED',
                    description: `${transaction.description} - Amount mismatch`
                },
            });
            return;
        }

        // Update transaction and wallet (idempotent check)
        await prisma.$transaction(async (tx) => {
            // Double-check status again to prevent race conditions
            const currentTxn = await tx.transaction.findUnique({
                where: { transactionId: receipt },
            });

            if (currentTxn?.status !== 'PENDING') {
                console.log('Transaction already processed by another request');
                return;
            }

            // Update transaction
            await tx.transaction.update({
                where: { transactionId: receipt },
                data: {
                    status: 'SUCCESS',
                    description: `${transaction.description} - Payment ID: ${razorpayPaymentId} (Webhook)`
                },
            });

            // Get current user
            const user = await tx.user.findUnique({
                where: { userId: transaction.userId },
            });

            if (!user) {
                throw new Error('User not found');
            }

            // Update wallet balance
            await tx.user.update({
                where: { userId: transaction.userId },
                data: {
                    walletBalance: user.walletBalance + amount,
                },
            });

            console.log(`✅ Webhook: ₹${amount} credited to ${user.userId} via webhook`);
        });
    } catch (error) {
        console.error('Handle payment captured error:', error);
    }
}

/**
 * Handle failed payment webhook
 */
async function handlePaymentFailed(payment: any): Promise<void> {
    try {
        const receipt = payment.order_id;
        const razorpayPaymentId = payment.id;

        console.log(`❌ Payment failed: ${razorpayPaymentId}`);

        // Find and update transaction
        const transaction = await prisma.transaction.findFirst({
            where: {
                transactionId: receipt,
                status: 'PENDING',
            },
        });

        if (transaction) {
            await prisma.transaction.update({
                where: { transactionId: receipt },
                data: {
                    status: 'FAILED',
                    description: `${transaction.description} - Payment failed: ${razorpayPaymentId}`
                },
            });

            console.log(`Transaction marked as failed: ${receipt}`);
        }
    } catch (error) {
        console.error('Handle payment failed error:', error);
    }
}
