package com.sanskriti.backend.service.impl;

import com.sanskriti.backend.dto.request.CreateBillRequest;
import com.sanskriti.backend.dto.response.BillResponse;
import com.sanskriti.backend.entity.Bill;
import com.sanskriti.backend.entity.Transaction;
import com.sanskriti.backend.entity.User;
import com.sanskriti.backend.enums.TransactionStatus;
import com.sanskriti.backend.enums.TransactionType;
import com.sanskriti.backend.exception.ApiException;
import com.sanskriti.backend.mapper.BillMapper;
import com.sanskriti.backend.repository.BillRepository;
import com.sanskriti.backend.repository.TransactionRepository;
import com.sanskriti.backend.repository.UserRepository;
import com.sanskriti.backend.service.BillService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BillServiceImpl implements BillService {

    private final BillRepository billRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final BillMapper billMapper;

    // ─────────────────────────────────────────────────────────────────────────
    // Public API
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public List<BillResponse> getAllBills() {
        return billRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(billMapper::toResponse).toList();
    }

    @Override
    public BillResponse getBillById(String id) {
        return billMapper.toResponse(
                billRepository.findById(id)
                        .orElseThrow(() -> new ApiException("Bill not found", HttpStatus.NOT_FOUND))
        );
    }

    @Override
    public List<BillResponse> getMyBills(String userId) {
        return billRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(billMapper::toResponse).toList();
    }

    /**
     * Core composite operation — creates a bill, records the debit transaction,
     * and deducts the user's wallet balance, all in one atomic @Transactional block.
     */
    @Override
    @Transactional
    public BillResponse createBill(CreateBillRequest request) {
        User user = validateAndGetUser(request.getUserId());
        double payableAmount = calculatePayableAmount(request);
        validateWalletBalance(user, payableAmount);

        String transactionId = TransactionServiceImpl.generateTransactionId();
        String invoiceNumber = generateInvoiceNumber();

        Bill savedBill = saveBill(request, user, transactionId, invoiceNumber, payableAmount);
        saveDebitTransaction(user, transactionId, invoiceNumber, request.getProductName(), payableAmount);
        deductWalletBalance(user, payableAmount);

        log.info("Bill created: {} | Invoice: {} | User: {} | Amount: ₹{}",
                savedBill.getId(), invoiceNumber, user.getUserId(), payableAmount);

        return billMapper.toResponse(savedBill);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Private helpers — each step of createBill extracted for readability
    // ─────────────────────────────────────────────────────────────────────────

    private User validateAndGetUser(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException(
                        "User with ID '" + userId + "' not found", HttpStatus.NOT_FOUND));

        if (user.getCompany() == null || user.getEmail() == null || user.getPhone() == null
                || user.getCompanyAddress() == null || user.getState() == null
                || user.getPin() == null || user.getGst() == null) {
            throw new ApiException(
                    "User does not have complete company details. Please update the user profile first.",
                    HttpStatus.BAD_REQUEST);
        }
        return user;
    }

    private void validateWalletBalance(User user, double payableAmount) {
        if (user.getWalletBalance() < payableAmount) {
            throw new ApiException(
                    String.format("Insufficient wallet balance. User has ₹%.2f but needs ₹%.2f",
                            user.getWalletBalance(), payableAmount),
                    HttpStatus.BAD_REQUEST);
        }
    }

    /** Formula: (qty × price + shipping + packaging) × (1 + tax/100), rounded to 2 dp */
    private double calculatePayableAmount(CreateBillRequest r) {
        double base = (r.getQuantity() * r.getPrice()) + r.getShippingCharge() + r.getPackagingCharge();
        double total = base + base * (r.getTaxPercent() / 100);
        return Math.round(total * 100.0) / 100.0;
    }

    /** Starts at STA3000 and increments from the highest existing invoice number */
    private String generateInvoiceNumber() {
        return billRepository.findTopByInvoiceNumberIsNotNullOrderByInvoiceNumberDesc()
                .map(last -> "STA" + (Integer.parseInt(last.getInvoiceNumber().replace("STA", "")) + 1))
                .orElse("STA3000");
    }

    private Bill saveBill(CreateBillRequest request, User user,
                          String transactionId, String invoiceNumber, double payableAmount) {
        Bill bill = Bill.builder()
                .userId(user.getUserId())
                .transactionId(transactionId)
                .invoiceNumber(invoiceNumber)
                // Company details always pulled from user profile, not from the request
                .company(user.getCompany())
                .email(user.getEmail())
                .phone(user.getPhone())
                .companyAddress(user.getCompanyAddress())
                .state(user.getState())
                .pin(user.getPin())
                .gst(user.getGst())
                .paymentMode("Razorpay Wallet")
                // Product details from request
                .productName(request.getProductName())
                .skuId(request.getSkuId())
                .quantity(request.getQuantity())
                .price(request.getPrice())
                .currency(request.getCurrency())
                .shippingCharge(request.getShippingCharge())
                .packagingCharge(request.getPackagingCharge())
                .taxPercent(request.getTaxPercent())
                .payableAmount(payableAmount)
                .build();

        return billRepository.save(bill);
    }

    private void saveDebitTransaction(User user, String transactionId,
                                      String invoiceNumber, String productName, double amount) {
        transactionRepository.save(Transaction.builder()
                .transactionId(transactionId)
                .userId(user.getUserId())
                .amount(amount)
                .type(TransactionType.DEBIT)
                .status(TransactionStatus.SUCCESS)
                .paymentMethod("RAZORPAY_WALLET")
                .description("Bill payment for " + productName + " (Inv: " + invoiceNumber + ")")
                .build());
    }

    private void deductWalletBalance(User user, double amount) {
        user.setWalletBalance(user.getWalletBalance() - amount);
        userRepository.save(user);
    }
}
