import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { RAZORPAY_CONFIG } from '../config/razorpay.config';

/**
 * Middleware to validate Razorpay webhook signature
 * This ensures the webhook request is genuinely from Razorpay
 */
export const validateWebhookSignature = (req: Request, res: Response, next: NextFunction): any => {
    try {
        const webhookSecret = RAZORPAY_CONFIG.WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error('Webhook secret not configured');
            return res.status(500).json({ error: 'Webhook configuration error' });
        }

        const receivedSignature = req.headers['x-razorpay-signature'] as string;

        if (!receivedSignature) {
            console.error('No signature in webhook request');
            return res.status(400).json({ error: 'Invalid webhook request' });
        }

        // Get raw body for signature verification
        const webhookBody = JSON.stringify(req.body);

        // Create expected signature
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(webhookBody)
            .digest('hex');

        // Compare signatures
        if (receivedSignature !== expectedSignature) {
            console.error('Webhook signature verification failed');
            return res.status(400).json({ error: 'Invalid webhook signature' });
        }

        // Signature is valid, proceed to controller
        next();
    } catch (error) {
        console.error('Webhook validation error:', error);
        return res.status(500).json({ error: 'Webhook validation failed' });
    }
};
