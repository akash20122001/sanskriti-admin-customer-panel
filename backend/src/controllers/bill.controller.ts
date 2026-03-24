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
// Calculate payable amount
function calculatePayableAmount(quantity: number, price: number, taxPercent: number, shippingCharge: number, packagingCharge: number): number {
    const subtotal = quantity * price;
    const baseAmount = subtotal + shippingCharge + packagingCharge;
    const taxAmount = baseAmount * (taxPercent / 100);
    const total = baseAmount + taxAmount;
    return parseFloat(total.toFixed(2));
}

// Generate Invoice Number (STA3000+)
// Globally unique and incremental across ALL users
async function generateInvoiceNumber(): Promise<string> {
    // Get all bills with invoice numbers
    const bills = await prisma.bill.findMany({
        where: { invoiceNumber: { not: null } },
        select: { invoiceNumber: true },
    });

    // If no bills exist, start with STA3000
    if (bills.length === 0) {
        return 'STA3000';
    }

    // Extract all numeric values from invoice numbers
    const numbers = bills
        .map(bill => {
            if (!bill.invoiceNumber) return 0;
            const match = bill.invoiceNumber.match(/STA(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
        })
        .filter(num => num > 0);

    // If no valid numbers found, start with STA3000
    if (numbers.length === 0) {
        return 'STA3000';
    }

    // Find the maximum number and increment
    const maxNum = Math.max(...numbers);
    const nextNum = maxNum + 1;

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
                productName,
                skuId,
                quantity,
                price,
                currency,
                shippingCharge,
                packagingCharge,
                taxPercent,
            } = req.body;

            //Validation
            if (!userId) return res.status(400).json({ error: 'User ID is required' });
            if (!productName || !skuId || !quantity || !price || !currency) {
                return res.status(400).json({ error: 'Missing required product details' });
            }

            if (quantity <= 0 || !Number.isInteger(quantity)) return res.status(400).json({ error: 'Quantity must be a positive integer' });
            if (price <= 0) return res.status(400).json({ error: 'Price must be greater than 0' });
            if (!['USD', 'INR'].includes(currency)) return res.status(400).json({ error: 'Invalid currency' });
            if (shippingCharge < 0) return res.status(400).json({ error: 'Shipping charge cannot be negative' });
            if (packagingCharge < 0) return res.status(400).json({ error: 'Packaging charge cannot be negative' });
            if (taxPercent < 0 || taxPercent > 100) return res.status(400).json({ error: 'Tax must be between 0 and 100' });

            // Calculate Amount FIRST
            const payableAmount = calculatePayableAmount(quantity, price, taxPercent || 0, shippingCharge || 0, packagingCharge || 0);

            // CRITICAL FIX: Check if user exists BEFORE creating bill
            const user = await prisma.user.findUnique({ where: { userId } });
            if (!user) {
                return res.status(404).json({ error: `User with ID '${userId}' not found` });
            }

            // CRITICAL: Fetch company details from user record
            if (!user.company || !user.email || !user.phone || !user.companyAddress || !user.state || !user.pin || !user.gst) {
                return res.status(400).json({
                    error: 'User does not have complete company details. Please update the user profile first.'
                });
            }

            // CRITICAL FIX: Check if user has sufficient wallet balance
            if (user.walletBalance < payableAmount) {
                return res.status(400).json({
                    error: `Insufficient wallet balance. User has ₹${user.walletBalance.toFixed(2)} but needs ₹${payableAmount.toFixed(2)}`
                });
            }

            // Generate IDs
            const transactionId = generateTransactionId();
            const invoiceNumber = await generateInvoiceNumber();

            // Create Bill with company details from user record
            const bill = await prisma.bill.create({
                data: {
                    userId,
                    transactionId,
                    invoiceNumber,
                    // Company details FROM USER RECORD
                    company: user.company,
                    email: user.email,
                    phone: user.phone,
                    companyAddress: user.companyAddress,
                    state: user.state,
                    pin: user.pin,
                    gst: user.gst,
                    paymentMode: 'Razorpay Wallet',
                    // Product details from request
                    productName,
                    skuId,
                    quantity,
                    price,
                    currency,
                    shippingCharge: shippingCharge || 0,
                    packagingCharge: packagingCharge || 0,
                    taxPercent: taxPercent || 0,
                    payableAmount,
                    invoiceUrl: null,
                },
            });

            // Create Transaction
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

            // Update User Wallet
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

    // Delete bill (admin only)
    async deleteBill(req: Request, res: Response): Promise<any> {
        try {
            const id = req.params.id as string;

            const existingBill = await prisma.bill.findUnique({ where: { id } });
            if (!existingBill) {
                return res.status(404).json({ error: 'Bill not found' });
            }

            // Refund user's wallet balance (only if bill is linked to a user)
            if (existingBill.userId) {
                const user = await prisma.user.findUnique({ where: { userId: existingBill.userId } });
                if (user) {
                    await prisma.user.update({
                        where: { userId: user.userId },
                        data: { walletBalance: user.walletBalance + existingBill.payableAmount },
                    });

                    // Log a reversal CREDIT transaction for audit trail
                    await prisma.transaction.create({
                        data: {
                            transactionId: `REV-${existingBill.transactionId}`,
                            userId: user.userId,
                            amount: existingBill.payableAmount,
                            type: 'CREDIT',
                            status: 'SUCCESS',
                            paymentMethod: 'RAZORPAY_WALLET',
                            description: `Reversal of bill ${existingBill.invoiceNumber ?? existingBill.transactionId} (bill deleted)`,
                        },
                    });
                }
            }

            await prisma.bill.delete({ where: { id } });

            res.json({ message: 'Bill deleted and amount refunded to user wallet successfully' });
        } catch (error) {
            console.error('Delete bill error:', error);
            res.status(500).json({ error: 'Failed to delete bill' });
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
