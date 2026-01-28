import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

interface Bill {
    id: string;
    transactionId: string;
    transactionDate: Date | string;
    company: string;
    email: string;
    phone: string;
    companyAddress: string;
    state: string;
    pin: string;
    gst: string;
    paymentMode: string;
    productName: string;
    skuId: string;
    quantity: number;
    price: number;
    currency: string;
    shippingCharge: number;
    taxPercent: number;
    payableAmount: number;
}

// Get currency symbol
function getCurrencySymbol(currency: string): string {
    return currency === 'USD' ? '$' : '₹';
}

// Format date
function formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

// Generate HTML for invoice
function generateInvoiceHTML(bill: Bill): string {
    const currencySymbol = getCurrencySymbol(bill.currency);
    const subtotal = bill.quantity * bill.price;
    const taxAmount = subtotal * (bill.taxPercent / 100);

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${bill.transactionId}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                padding: 40px;
                background: white;
                color: #333;
            }
            
            .invoice-container {
                max-width: 800px;
                margin: 0 auto;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                overflow: hidden;
            }
            
            .invoice-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px 40px;
            }
            
            .invoice-title {
                font-size: 32px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            
            .company-name {
                font-size: 18px;
                opacity: 0.95;
            }
            
            .transaction-info {
                background: #f8f9fa;
                padding: 20px 40px;
                border-bottom: 2px solid #e0e0e0;
                display: flex;
                justify-content: space-between;
            }
            
            .info-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .info-label {
                font-size: 12px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .info-value {
                font-size: 16px;
                font-weight: 600;
                color: #333;
            }
            
            .invoice-body {
                padding: 30px 40px;
            }
            
            .section {
                margin-bottom: 30px;
            }
            
            .section-title {
                font-size: 14px;
                font-weight: 600;
                color: #667eea;
                text-transform: uppercase;
                margin-bottom: 15px;
                letter-spacing: 0.5px;
                border-bottom: 2px solid #667eea;
                padding-bottom: 5px;
            }
            
            .details-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px 30px;
            }
            
            .detail-item {
                display: flex;
                flex-direction: column;
                gap: 3px;
            }
            
            .detail-label {
                font-size: 11px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }
            
            .detail-value {
                font-size: 14px;
                color: #333;
                font-weight: 500;
            }
            
            .product-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            }
            
            .product-table th {
                background: #f8f9fa;
                padding: 12px;
                text-align: left;
                font-size: 12px;
                text-transform: uppercase;
                color: #666;
                border-bottom: 2px solid #e0e0e0;
            }
            
            .product-table td {
                padding: 15px 12px;
                border-bottom: 1px solid #e0e0e0;
                font-size: 14px;
            }
            
            .amount-breakdown {
                margin-top: 20px;
                background: #f8f9fa;
                border-radius: 6px;
                padding: 20px;
            }
            
            .breakdown-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                font-size: 14px;
            }
            
            .breakdown-row.total {
                border-top: 2px solid #667eea;
                margin-top: 10px;
                padding-top: 15px;
                font-size: 18px;
                font-weight: bold;
                color: #667eea;
            }
            
            .payment-mode-box {
                background: #667eea;
                color: white;
                padding: 15px;
                border-radius: 6px;
                text-align: center;
                margin-top: 20px;
            }
            
            .payment-mode-label {
                font-size: 11px;
                text-transform: uppercase;
                opacity: 0.9;
                margin-bottom: 5px;
                letter-spacing: 0.5px;
            }
            
            .payment-mode-value {
                font-size: 16px;
                font-weight: 600;
            }
            
            .invoice-footer {
                background: #f8f9fa;
                padding: 20px 40px;
                text-align: center;
                border-top: 2px solid #e0e0e0;
                font-size: 12px;
                color: #666;
            }
            
            .footer-note {
                margin-top: 10px;
                font-style: italic;
            }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <!-- Header -->
            <div class="invoice-header">
                <div class="invoice-title">INVOICE</div>
                <div class="company-name">SANSKRITI</div>
            </div>
            
            <!-- Transaction Info -->
            <div class="transaction-info">
                <div class="info-group">
                    <div class="info-label">Transaction ID</div>
                    <div class="info-value">${bill.transactionId}</div>
                </div>
                <div class="info-group">
                    <div class="info-label">Transaction Date</div>
                    <div class="info-value">${formatDate(bill.transactionDate)}</div>
                </div>
            </div>
            
            <!-- Body -->
            <div class="invoice-body">
                <!-- Bill To Section -->
                <div class="section">
                    <div class="section-title">Bill To</div>
                    <div class="details-grid">
                        <div class="detail-item">
                            <div class="detail-label">Company Name</div>
                            <div class="detail-value">${bill.company}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Email</div>
                            <div class="detail-value">${bill.email}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Phone</div>
                            <div class="detail-value">${bill.phone}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">GST Number</div>
                            <div class="detail-value">${bill.gst}</div>
                        </div>
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <div class="detail-label">Address</div>
                            <div class="detail-value">${bill.companyAddress}, ${bill.state}, ${bill.pin}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Product Details Section -->
                <div class="section">
                    <div class="section-title">Product Details</div>
                    <table class="product-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${bill.productName}</td>
                                <td>${bill.skuId}</td>
                                <td>${bill.quantity}</td>
                                <td>${currencySymbol}${bill.price.toFixed(2)}</td>
                                <td>${currencySymbol}${subtotal.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <!-- Amount Breakdown -->
                    <div class="amount-breakdown">
                        <div class="breakdown-row">
                            <span>Subtotal:</span>
                            <span>${currencySymbol}${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="breakdown-row">
                            <span>Shipping Charge:</span>
                            <span>${currencySymbol}${bill.shippingCharge.toFixed(2)}</span>
                        </div>
                        <div class="breakdown-row">
                            <span>Tax (${bill.taxPercent}%):</span>
                            <span>${currencySymbol}${taxAmount.toFixed(2)}</span>
                        </div>
                        <div class="breakdown-row total">
                            <span>TOTAL PAYABLE:</span>
                            <span>${currencySymbol}${bill.payableAmount.toFixed(2)} ${bill.currency}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Payment Mode -->
                <div class="payment-mode-box">
                    <div class="payment-mode-label">Payment Mode</div>
                    <div class="payment-mode-value">${bill.paymentMode}</div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="invoice-footer">
                <strong>Thank you for your business!</strong>
                <div class="footer-note">
                    This is a computer-generated invoice and does not require a signature.
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Generate PDF invoice
export async function generateInvoicePDF(bill: Bill): Promise<string> {
    const invoicesDir = path.join(__dirname, '../../invoices');

    // Create invoices directory if it doesn't exist
    if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const filename = `invoice-${bill.transactionId}.pdf`;
    const filepath = path.join(invoicesDir, filename);

    // Generate HTML
    const html = generateInvoiceHTML(bill);

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        await page.pdf({
            path: filepath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0',
                right: '0',
                bottom: '0',
                left: '0',
            },
        });

        console.log(`Invoice PDF generated: ${filename}`);

        return `/invoices/${filename}`;
    } finally {
        await browser.close();
    }
}
