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
    const taxAmount = subtotal * (taxPercent / 100);
    const total = subtotal + taxAmount + shippingCharge;
    return parseFloat(total.toFixed(2));
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
            if (!company || !email || !phone || !companyAddress || !state || !pin || !gst) {
                return res.status(400).json({ error: 'Missing required company details' });
            }

            if (!productName || !skuId || !quantity || !price || !currency) {
                return res.status(400).json({ error: 'Missing required product details' });
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email address' });
            }

            // Phone validation (10 digits)
            if (!/^\d{10}$/.test(phone)) {
                return res.status(400).json({ error: 'Phone must be 10 digits' });
            }

            // PIN validation (6 digits)
            if (!/^\d{6}$/.test(pin)) {
                return res.status(400).json({ error: 'PIN must be 6 digits' });
            }

            // GST validation (15 alphanumeric characters)
            if (!/^[A-Z0-9]{15}$/.test(gst)) {
                return res.status(400).json({ error: 'GST must be 15 alphanumeric characters' });
            }

            // Quantity validation
            if (quantity <= 0 || !Number.isInteger(quantity)) {
                return res.status(400).json({ error: 'Quantity must be a positive integer' });
            }

            // Price validation
            if (price <= 0) {
                return res.status(400).json({ error: 'Price must be greater than 0' });
            }

            // Currency validation
            if (!['USD', 'INR'].includes(currency)) {
                return res.status(400).json({ error: 'Invalid currency' });
            }

            // Shipping charge validation
            if (shippingCharge < 0) {
                return res.status(400).json({ error: 'Shipping charge cannot be negative' });
            }

            // Tax validation
            if (taxPercent < 0 || taxPercent > 100) {
                return res.status(400).json({ error: 'Tax must be between 0 and 100' });
            }

            // Generate unique transaction ID
            const transactionId = generateTransactionId();

            // Calculate payable amount (always calculate server-side for security)
            const payableAmount = calculatePayableAmount(
                quantity,
                price,
                taxPercent || 0,
                shippingCharge || 0
            );

            // Create bill in database
            const bill = await prisma.bill.create({
                data: {
                    transactionId,
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
                    invoiceUrl: null, // Will be updated after PDF generation
                },
            });

            // Generate PDF invoice asynchronously
            try {
                const invoiceUrl = await generateInvoicePDF(bill);

                // Update bill with invoice URL
                const updatedBill = await prisma.bill.update({
                    where: { id: bill.id },
                    data: { invoiceUrl },
                });

                res.status(201).json({ bill: updatedBill });
            } catch (pdfError) {
                console.error('PDF generation error:', pdfError);
                // Return bill even if PDF generation fails
                res.status(201).json({
                    bill,
                    warning: 'Bill created but invoice generation failed. Please try again later.',
                });
            }
        } catch (error) {
            console.error('Create bill error:', error);
            res.status(500).json({ error: 'Failed to create bill' });
        }
    },
};
