package com.sanskriti.backend.service;

import com.sanskriti.backend.entity.Bill;
import com.sanskriti.backend.entity.Settings;

public interface PdfService {
    /**
     * Generates a PDF invoice identical to the Node.js implementation.
     * Returns the relative path or URL to the generated PDF (e.g., "/invoices/invoice-TXN-XYZ.pdf").
     */
    String generateInvoicePdf(Bill bill, Settings settings);
}
