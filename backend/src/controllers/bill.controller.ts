import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { generateInvoicePDF } from '../utils/pdfGenerator';

const prisma = new PrismaClient();

// Generate unique transaction ID using UUID v4 + timestamp for extra security
function generateTransactionId(): string {
    const uuid = crypto.randomUUID();
    const timestamp = Date.now().toString(36);
    const randomPart = uuid.split('-')[0].toUpperCase();
    return `TXN-${timestamp}-${randomPart}`;
}

// Calculate payable amount
function calculatePayableAmount(quantity: number, price: number, taxPercent: number, shippingCharge: number): number {
    const subtotal = quantity * price;
    const subtotalWithShipping = subtotal + shippingCharge;
    const taxAmount = subtotalWithShipping * (taxPercent / 100);
    const total = subtotalWithShipping + taxAmount;
    return parseFloat(total.toFixed(2));
}

// Generate Invoice Number (STA3000+)
async function generateInvoiceNumber(): Promise<string> {
    const lastBill = await prisma.bill.findFirst({
        where: { invoiceNumber: { not: null } },
        orderBy: { createdAt: 'desc' },
    });

    if (!lastBill || !lastBill.invoiceNumber) {
        return 'STA3000';
    }

    const match = lastBill.invoiceNumber.match(/STA(\d+)/);
    if (!match) {
        return 'STA3000';
    }

    const nextNum = parseInt(match[1], 10) + 1;
    return `STA${nextNum}`;
}

export const billController = {
    // Get all bills (admin only)
    async getAllBills(_req: Request, res: Response): Promise<any> {
        try {
            const bills = await prisma.bill.findMany({
                orderBy: {
                    transactionDate: 'desc',
                },
            });

            res.json({ bills });
        } catch (error) {
            console.error('Get all bills error:', error);
            res.status(500).json({ error: 'Failed to fetch bills' });
        }
    },

    // Get single bill by ID (admin only)
    async getBillById(req: Request, res: Response): Promise<any> {
        try {
            const id = req.params.id as string;

            const bill = await prisma.bill.findUnique({
                where: { id },
            });

            if (!bill) {
                return res.status(404).json({ error: 'Bill not found' });
            }

            res.json({ bill });
        } catch (error) {
            console.error('Get bill by ID error:', error);
            res.status(500).json({ error: 'Failed to fetch bill' });
        }
    },

    // Create new bill and generate invoice (admin only)
    async createBill(req: Request, res: Response): Promise<any> {
        try {
            const {
                userId,
                company,
                email,
                phone,
                companyAddress,
                state,
                pin,
                gst,
                productName,
                skuId,
                quantity,
                price,
                currency,
                shippingCharge,
                taxPercent,
            } = req.body;

            // Validation
            if (!userId) return res.status(400).json({ error: 'User ID is required' });
            if (!company || !email || !phone || !companyAddress || !state || !pin || !gst) {
                return res.status(400).json({ error: 'Missing required company details' });
            }
            if (!productName || !skuId || !quantity || !price || !currency) {
                return res.status(400).json({ error: 'Missing required product details' });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email address' });
            if (!/^\d{10}$/.test(phone)) return res.status(400).json({ error: 'Phone must be 10 digits' });
            if (!/^\d{6}$/.test(pin)) return res.status(400).json({ error: 'PIN must be 6 digits' });
            if (!/^[A-Z0-9]{15}$/.test(gst)) return res.status(400).json({ error: 'GST must be 15 alphanumeric characters' });
            if (quantity <= 0 || !Number.isInteger(quantity)) return res.status(400).json({ error: 'Quantity must be a positive integer' });
            if (price <= 0) return res.status(400).json({ error: 'Price must be greater than 0' });
            if (!['USD', 'INR'].includes(currency)) return res.status(400).json({ error: 'Invalid currency' });
            if (shippingCharge < 0) return res.status(400).json({ error: 'Shipping charge cannot be negative' });
            if (taxPercent < 0 || taxPercent > 100) return res.status(400).json({ error: 'Tax must be between 0 and 100' });

            // Generate IDs
            const transactionId = generateTransactionId();
            const invoiceNumber = await generateInvoiceNumber();

            // Calculate Amount
            const payableAmount = calculatePayableAmount(quantity, price, taxPercent || 0, shippingCharge || 0);

            // Create Bill
            const bill = await prisma.bill.create({
                data: {
                    userId,
                    transactionId,
                    invoiceNumber,
                    company,
                    email,
                    phone,
                    companyAddress,
                    state,
                    pin,
                    gst,
                    paymentMode: 'Razorpay Wallet',
                    productName,
                    skuId,
                    quantity,
                    price,
                    currency,
                    shippingCharge: shippingCharge || 0,
                    taxPercent: taxPercent || 0,
                    payableAmount,
                    invoiceUrl: null,
                },
            });

            // Update User Wallet & Transaction
            const user = await prisma.user.findUnique({ where: { userId } });
            if (!user) return res.status(404).json({ error: `User with ID '${userId}' not found` });

            await prisma.transaction.create({
                data: {
                    transactionId,
                    userId: user.userId,
                    amount: payableAmount,
                    type: 'DEBIT',
                    status: 'SUCCESS',
                    paymentMethod: 'RAZORPAY_WALLET',
                    description: `Bill payment for ${productName} (Inv: ${invoiceNumber})`,
                },
            });

            await prisma.user.update({
                where: { userId: user.userId },
                data: { walletBalance: user.walletBalance - payableAmount },
            });

            // Generate PDF
            try {
                // Fetch settings
                let settings = await prisma.settings.findFirst();

                // Pass settings to generator (defaults handled in generator if passed undefined, but we pass concrete object here)
                const invoiceUrl = await generateInvoicePDF(bill, {
                    companyPan: settings?.companyPan || 'CANPJ8390R',
                    companyGst: settings?.companyGst || '08CANPJ3390R1ZT'
                });

                await prisma.bill.update({ where: { id: bill.id }, data: { invoiceUrl } });

                const finalBill = await prisma.bill.findUnique({ where: { id: bill.id } });
                res.status(201).json({ bill: finalBill });
            } catch (pdfError) {
                console.error('PDF generation error:', pdfError);
                res.status(201).json({ bill, warning: 'Invoice generation failed.' });
            }

        } catch (error) {
            console.error('Create bill error:', error);
            res.status(500).json({ error: 'Failed to create bill' });
        }
    },

    // Get customer's bills
    async getCustomerBills(req: Request, res: Response): Promise<any> {
        try {
            const userId = (req as any).userIdString;
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            const bills = await prisma.bill.findMany({
                where: {
                    OR: [
                        { userId: userId },
                        { email: { contains: userId } },
                        { company: { contains: userId } },
                    ]
                },
                orderBy: { transactionDate: 'desc' },
            });

            res.json({ bills });
        } catch (error) {
            console.error('Get customer bills error:', error);
            res.status(500).json({ error: 'Failed to fetch bills' });
        }
    },
};
