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
    invoiceNumber?: string | null;
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

export interface CompanySettings {
    companyPan: string;
    companyGst: string;
}

// Generate HTML for invoice
function generateInvoiceHTML(bill: Bill, invoiceNumber: string | undefined, settings: CompanySettings): string {
    const currencySymbol = getCurrencySymbol(bill.currency);
    // ... (rest of logic same until footer)
    // line 225-226:
    // <div>Company PAN: ${settings.companyPan}</div>
    // <div>Company GSTIN/UIN: ${settings.companyGst}</div>

    const subtotal = bill.quantity * bill.price;
    const taxAmount = subtotal * (bill.taxPercent / 100);

    // Process Logo
    const logoPath = path.join(__dirname, '../assets/logo.png');
    let logoHtml = '<div class="company-name" style="font-size: 24px; font-weight: bold;">SANSKRITI</div>';

    if (fs.existsSync(logoPath)) {
        try {
            const logoData = fs.readFileSync(logoPath).toString('base64');
            logoHtml = `<img src="data:image/png;base64,${logoData}" alt="Logo" style="height: 60px; margin-bottom: 10px;" />`;
        } catch (e) {
            console.error('Error reading logo:', e);
        }
    }

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoiceNumber || bill.transactionId}</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background: white; color: #333; }
            .invoice-container { max-width: 800px; margin: 0 auto; border: 2px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
            .invoice-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 30px; }
            .invoice-title { font-size: 28px; font-weight: bold; margin-bottom: 5px; margin-top: 5px; }
            .transaction-info { background: #f8f9fa; padding: 15px 30px; border-bottom: 2px solid #e0e0e0; display: flex; justify-content: space-between; }
            .info-group { display: flex; flex-direction: column; gap: 3px; }
            .info-label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
            .info-value { font-size: 14px; font-weight: 600; color: #333; }
            .invoice-body { padding: 20px 30px; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 13px; font-weight: 600; color: #667eea; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.5px; border-bottom: 2px solid #667eea; padding-bottom: 3px; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 30px; }
            .detail-item { display: flex; flex-direction: column; gap: 2px; }
            .detail-label { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.3px; }
            .detail-value { font-size: 13px; color: #333; font-weight: 500; }
            .product-table { width: 100%; border-collapse: collapse; margin-top: 5px; }
            .product-table th { background: #f8f9fa; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; color: #666; border-bottom: 2px solid #e0e0e0; }
            .product-table td { padding: 12px 10px; border-bottom: 1px solid #e0e0e0; font-size: 13px; }
            .amount-breakdown { margin-top: 15px; background: #f8f9fa; border-radius: 6px; padding: 15px; }
            .breakdown-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; }
            .breakdown-row.total { border-top: 2px solid #667eea; margin-top: 8px; padding-top: 10px; font-size: 16px; font-weight: bold; color: #667eea; }
            .payment-mode-box { background: #667eea; color: white; padding: 10px; border-radius: 6px; text-align: center; margin-top: 15px; }
            .payment-mode-label { font-size: 10px; text-transform: uppercase; opacity: 0.9; margin-bottom: 3px; letter-spacing: 0.5px; }
            .payment-mode-value { font-size: 14px; font-weight: 600; }
            .invoice-footer { background: #f8f9fa; padding: 15px 30px; border-top: 2px solid #e0e0e0; font-size: 11px; color: #666; display: flex; justify-content: space-between; gap: 20px; }
            .footer-section { flex: 1; }
            .footer-title { font-weight: bold; margin-bottom: 5px; color: #333; }
            .footer-list { list-style: none; padding: 0; }
            .footer-list li { margin-bottom: 3px; position: relative; padding-left: 10px; }
            .footer-list li::before { content: "•"; position: absolute; left: 0; }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <!-- Header -->
            <div class="invoice-header">
                ${logoHtml}
                <div class="invoice-title">INVOICE</div>
                <div style="font-size: 14px; opacity: 0.9;">Invoice Number - ${invoiceNumber || ''}</div>
            </div>
            
            <!-- Transaction Info -->
            <div class="transaction-info">
                <div class="info-group">
                    <div class="info-label">Transaction ID</div>
                    <div class="info-value">${bill.transactionId}</div>
                </div>
                <div class="info-group" style="text-align: right;">
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
                            <div class="detail-label">Name</div>
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
                        <div class="detail-item">
                            <div class="detail-label">State</div>
                            <div class="detail-value">${bill.state}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">PIN Code</div>
                            <div class="detail-value">${bill.pin}</div>
                        </div>
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <div class="detail-label">Address</div>
                            <div class="detail-value">${bill.companyAddress}</div>
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
                <div class="footer-section">
                    <div class="footer-title">Terms & Conditions</div>
                    <ul class="footer-list">
                        <li>Online download only. No physical delivery.</li>
                        <li>Goods once sold will not be taken back or exchanged.</li>
                        <li>Seller is not responsible for any loss or damage of goods in transit.</li>
                    </ul>
                </div>
                <div class="footer-section" style="text-align: right;">
                    <div class="footer-title">Company Details</div>
                    <div>Company PAN: ${settings.companyPan}</div>
                    <div>Company GSTIN/UIN: ${settings.companyGst}</div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Generate PDF invoice
export async function generateInvoicePDF(bill: Bill, settings: CompanySettings): Promise<string> {
    const invoicesDir = path.join(__dirname, '../../invoices');

    // Create invoices directory if it doesn't exist
    if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const filename = `invoice-${bill.transactionId}.pdf`;
    const filepath = path.join(invoicesDir, filename);

    // Generate HTML
    const html = generateInvoiceHTML(bill, bill.invoiceNumber || undefined, settings);

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
