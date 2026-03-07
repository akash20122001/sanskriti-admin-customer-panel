package com.sanskriti.backend.service.impl;

import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.io.source.ByteArrayOutputStream;
import com.sanskriti.backend.entity.Bill;
import com.sanskriti.backend.entity.Settings;
import com.sanskriti.backend.service.PdfService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@Slf4j
@Service
public class PdfServiceImpl implements PdfService {

    @Value("${file.upload.dir:../../invoices}")
    private String invoicesDirTemplate;

    @Override
    public String generateInvoicePdf(Bill bill, Settings settings) {
        String filename = "invoice-" + bill.getTransactionId() + ".pdf";

        // Resolve absolute path to the generic Node.js "invoices" dir running locally to match exactly
        // Node.js path was path.join(__dirname, '../../invoices')
        // Here we'll just put it in a clean 'invoices' folder at the backend root level.
        Path invoicesPath = Paths.get("invoices").toAbsolutePath().normalize();
        
        try {
            if (!Files.exists(invoicesPath)) {
                Files.createDirectories(invoicesPath);
            }
        } catch (IOException e) {
            log.error("Failed to create invoices directory at {}", invoicesPath, e);
            throw new RuntimeException("Could not create invoice directory");
        }

        Path finalFilePath = invoicesPath.resolve(filename);

        String html = generateInvoiceHtml(bill, settings);

        try (FileOutputStream outputStream = new FileOutputStream(finalFilePath.toFile())) {
            
            // Convert HTML String to PDF using iText
            ConverterProperties properties = new ConverterProperties();
            HtmlConverter.convertToPdf(html, outputStream, properties);
            
            log.info("Invoice PDF generated: {}", filename);
            
            // Return exactly the string the Node backend returned
            return "/invoices/" + filename;
            
        } catch (IOException e) {
            log.error("Failed to generate PDF invoice for transaction {}", bill.getTransactionId(), e);
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    private String getCurrencySymbol(com.sanskriti.backend.enums.Currency currency) {
        return currency == com.sanskriti.backend.enums.Currency.USD ? "$" : "₹";
    }

    private String formatDate(java.time.LocalDateTime date) {
        if (date == null) return "N/A";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return date.format(formatter);
    }

    private String generateInvoiceHtml(Bill bill, Settings settings) {
        String currencySymbol = getCurrencySymbol(bill.getCurrency());
        
        String invoiceNumber = bill.getInvoiceNumber() != null ? bill.getInvoiceNumber() : bill.getTransactionId();
        
        String companyPan = settings != null && settings.getCompanyPan() != null ? settings.getCompanyPan() : "CANPJ8390R";
        String companyGst = settings != null && settings.getCompanyGst() != null ? settings.getCompanyGst() : "08CANPJ3390R1ZT";

        double subtotal = bill.getQuantity() * bill.getPrice();
        double shippingCharge = bill.getShippingCharge();
        double packagingCharge = bill.getPackagingCharge();
        double baseAmount = subtotal + shippingCharge + packagingCharge;
        double taxAmount = baseAmount * (bill.getTaxPercent() / 100);

        // Logo fallback (matching Node.js behavior exactly)
        String logoHtml = "<div class=\"company-name\" style=\"font-size: 24px; font-weight: bold; color: #000;\">SANSKRITI</div>";
        
        // This relies on the logo being at src/main/resources/assets/logo.png optionally, but falling back otherwise.
        Path logoPath = Paths.get("src", "main", "resources", "assets", "logo.png");
        if (Files.exists(logoPath)) {
            try {
                byte[] logoBytes = Files.readAllBytes(logoPath);
                String base64Logo = Base64.getEncoder().encodeToString(logoBytes);
                logoHtml = "<img src=\"data:image/png;base64," + base64Logo + "\" alt=\"Logo\" style=\"height: 60px; margin-bottom: 5px;\" />";
            } catch (IOException e) {
                log.error("Failed to read logo image", e);
            }
        }

        return "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <title>Invoice " + invoiceNumber + "</title>\n" +
                "    <style>\n" +
                "        * { margin: 0; padding: 0; box-sizing: border-box; }\n" +
                "        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background: white; color: #333; }\n" +
                "        .invoice-container { max-width: 800px; margin: 0 auto; border: 2px solid #e0e0e0; border-radius: 8px; overflow: hidden; }\n" +
                "        .invoice-header { background: #ffffff; color: #000; padding: 20px 30px; text-align: center; border-bottom: 2px solid #000; }\n" +
                "        .invoice-title { font-size: 28px; font-weight: bold; margin-bottom: 5px; margin-top: 10px; color: #000; }\n" +
                "        .transaction-info { background: #f8f9fa; padding: 15px 30px; border-bottom: 2px solid #e0e0e0; display: flex; justify-content: space-between; }\n" + // display: flex will map reasonably well in iText 7.1+
                "        .info-group { display: inline-block; width: 49%; flex-direction: column; gap: 3px; }\n" + // added inline-block width for PDF compatibility
                "        .info-label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }\n" +
                "        .info-value { font-size: 14px; font-weight: 600; color: #000; }\n" +
                "        .invoice-body { padding: 20px 30px; }\n" +
                "        .section { margin-bottom: 20px; }\n" +
                "        .section-title { font-size: 13px; font-weight: 600; color: #000; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.5px; border-bottom: 2px solid #000; padding-bottom: 3px; }\n" +
                "        .details-grid { display: block; }\n" +
                "        .detail-item { display: inline-block; width: 45%; margin-bottom: 15px; vertical-align: top; }\n" +
                "        .detail-item-full { display: block; width: 100%; margin-bottom: 15px; }\n" +
                "        .detail-label { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.3px; }\n" +
                "        .detail-value { font-size: 13px; color: #000; font-weight: 500; }\n" +
                "        .product-table { width: 100%; border-collapse: collapse; margin-top: 5px; }\n" +
                "        .product-table th { background: #f8f9fa; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; color: #666; border-bottom: 2px solid #e0e0e0; }\n" +
                "        .product-table td { padding: 12px 10px; border-bottom: 1px solid #e0e0e0; font-size: 13px; color: #000; }\n" +
                "        .amount-breakdown { margin-top: 15px; background: #f8f9fa; border-radius: 6px; padding: 15px; text-align: right; }\n" +
                "        .breakdown-row { padding: 5px 0; font-size: 13px; color: #000; }\n" +
                "        .breakdown-row span { display: inline-block; width: 120px; text-align: right; }\n" +
                "        .breakdown-row span:first-child { width: 150px; text-align: left; }\n" +
                "        .breakdown-row.total { border-top: 2px solid #000; margin-top: 8px; padding-top: 10px; font-size: 16px; font-weight: bold; color: #000; }\n" +
                "        .payment-mode-box { background: #000; color: white; padding: 10px; border-radius: 6px; text-align: center; margin-top: 15px; }\n" +
                "        .payment-mode-label { font-size: 10px; text-transform: uppercase; opacity: 0.9; margin-bottom: 3px; letter-spacing: 0.5px; }\n" +
                "        .payment-mode-value { font-size: 14px; font-weight: 600; }\n" +
                "        .invoice-footer { background: #f8f9fa; padding: 15px 30px; border-top: 2px solid #e0e0e0; font-size: 11px; color: #666; }\n" +
                "        .footer-section { display: inline-block; width: 49%; vertical-align: top; }\n" +
                "        .footer-title { font-weight: bold; margin-bottom: 5px; color: #000; }\n" +
                "        .footer-list { list-style: none; padding: 0; }\n" +
                "        .footer-list li { margin-bottom: 3px; position: relative; padding-left: 10px; }\n" +
                "        .footer-list li::before { content: \"\\2022\"; position: absolute; left: 0; }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"invoice-container\">\n" +
                "        <!-- Header -->\n" +
                "        <div class=\"invoice-header\">\n" +
                "            " + logoHtml + "\n" +
                "            <div class=\"invoice-title\">INVOICE</div>\n" +
                "        </div>\n" +
                "        \n" +
                "        <!-- Invoice Number Info -->\n" +
                "        <div class=\"transaction-info\">\n" +
                "            <div class=\"info-group\">\n" +
                "                <div class=\"info-label\">Invoice Number</div>\n" +
                "                <div class=\"info-value\">" + invoiceNumber + "</div>\n" +
                "            </div>\n" +
                "            <div class=\"info-group\" style=\"text-align: right;\">\n" +
                "                <div class=\"info-label\">Invoice Date</div>\n" +
                "                <div class=\"info-value\">" + formatDate(bill.getTransactionDate()) + "</div>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "        \n" +
                "        <!-- Body -->\n" +
                "        <div class=\"invoice-body\">\n" +
                "            <!-- Bill To Section -->\n" +
                "            <div class=\"section\">\n" +
                "                <div class=\"section-title\">Bill To</div>\n" +
                "                <div class=\"details-grid\">\n" +
                "                    <div class=\"detail-item\">\n" +
                "                        <div class=\"detail-label\">Name</div>\n" +
                "                        <div class=\"detail-value\">" + bill.getCompany() + "</div>\n" +
                "                    </div>\n" +
                "                    <div class=\"detail-item\">\n" +
                "                        <div class=\"detail-label\">Email</div>\n" +
                "                        <div class=\"detail-value\">" + bill.getEmail() + "</div>\n" +
                "                    </div>\n" +
                "                    <div class=\"detail-item\">\n" +
                "                        <div class=\"detail-label\">Phone</div>\n" +
                "                        <div class=\"detail-value\">" + bill.getPhone() + "</div>\n" +
                "                    </div>\n" +
                "                    <div class=\"detail-item\">\n" +
                "                        <div class=\"detail-label\">GST Number</div>\n" +
                "                        <div class=\"detail-value\">" + bill.getGst() + "</div>\n" +
                "                    </div>\n" +
                "                    <div class=\"detail-item\">\n" +
                "                        <div class=\"detail-label\">State</div>\n" +
                "                        <div class=\"detail-value\">" + bill.getState() + "</div>\n" +
                "                    </div>\n" +
                "                    <div class=\"detail-item\">\n" +
                "                        <div class=\"detail-label\">PIN Code</div>\n" +
                "                        <div class=\"detail-value\">" + bill.getPin() + "</div>\n" +
                "                    </div>\n" +
                "                    <div class=\"detail-item-full\">\n" +
                "                        <div class=\"detail-label\">Address</div>\n" +
                "                        <div class=\"detail-value\">" + bill.getCompanyAddress() + "</div>\n" +
                "                    </div>\n" +
                "                </div>\n" +
                "            </div>\n" +
                "            \n" +
                "            <!-- Product Details Section -->\n" +
                "            <div class=\"section\">\n" +
                "                <div class=\"section-title\">Product Details</div>\n" +
                "                <table class=\"product-table\">\n" +
                "                    <thead>\n" +
                "                        <tr>\n" +
                "                            <th>Product</th>\n" +
                "                            <th>SKU</th>\n" +
                "                            <th>Qty</th>\n" +
                "                            <th>Price</th>\n" +
                "                            <th>Amount</th>\n" +
                "                        </tr>\n" +
                "                    </thead>\n" +
                "                    <tbody>\n" +
                "                        <tr>\n" +
                "                            <td>" + bill.getProductName() + "</td>\n" +
                "                            <td>" + bill.getSkuId() + "</td>\n" +
                "                            <td>" + bill.getQuantity() + "</td>\n" +
                "                            <td>" + currencySymbol + String.format("%.2f", bill.getPrice()) + "</td>\n" +
                "                            <td>" + currencySymbol + String.format("%.2f", subtotal) + "</td>\n" +
                "                        </tr>\n" +
                "                    </tbody>\n" +
                "                </table>\n" +
                "                \n" +
                "                <!-- Amount Breakdown -->\n" +
                "                <div class=\"amount-breakdown\">\n" +
                "                    <div class=\"breakdown-row\">\n" +
                "                        <span>Subtotal:</span>\n" +
                "                        <span>" + currencySymbol + String.format("%.2f", subtotal) + "</span>\n" +
                "                    </div>\n" +
                "                    <div class=\"breakdown-row\">\n" +
                "                        <span>Shipping Charge:</span>\n" +
                "                        <span>" + currencySymbol + String.format("%.2f", shippingCharge) + "</span>\n" +
                "                    </div>\n" +
                "                    <div class=\"breakdown-row\">\n" +
                "                        <span>Packaging Charge:</span>\n" +
                "                        <span>" + currencySymbol + String.format("%.2f", packagingCharge) + "</span>\n" +
                "                    </div>\n" +
                "                    <div class=\"breakdown-row\">\n" +
                "                        <span>Tax (" + bill.getTaxPercent() + "%):</span>\n" +
                "                        <span>" + currencySymbol + String.format("%.2f", taxAmount) + "</span>\n" +
                "                    </div>\n" +
                "                    <div class=\"breakdown-row total\">\n" +
                "                        <span>TOTAL PAYABLE:</span>\n" +
                "                        <span>" + currencySymbol + String.format("%.2f", bill.getPayableAmount()) + " " + bill.getCurrency() + "</span>\n" +
                "                    </div>\n" +
                "                </div>\n" +
                "            </div>\n" +
                "            \n" +
                "            <!-- Payment Mode -->\n" +
                "            <div class=\"payment-mode-box\">\n" +
                "                <div class=\"payment-mode-label\">Payment Mode</div>\n" +
                "                <div class=\"payment-mode-value\">" + bill.getPaymentMode() + "</div>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "        \n" +
                "        <!-- Footer -->\n" +
                "        <div class=\"invoice-footer\">\n" +
                "            <div class=\"footer-section\">\n" +
                "                <div class=\"footer-title\">Terms & Conditions</div>\n" +
                "                <ul class=\"footer-list\">\n" +
                "                    <li>Online download only. No physical delivery.</li>\n" +
                "                    <li>Goods once sold will not be taken back or exchanged.</li>\n" +
                "                    <li>Seller is not responsible for any loss or damage of goods in transit.</li>\n" +
                "                </ul>\n" +
                "            </div>\n" +
                "            <div class=\"footer-section\" style=\"text-align: right;\">\n" +
                "                <div class=\"footer-title\">Company Details</div>\n" +
                "                <div>Company PAN: " + companyPan + "</div>\n" +
                "                <div>Company GSTIN/UIN: " + companyGst + "</div>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }
}
