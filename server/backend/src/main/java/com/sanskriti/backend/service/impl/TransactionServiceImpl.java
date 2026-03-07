package com.sanskriti.backend.service.impl;

import com.sanskriti.backend.dto.request.CreateTransactionRequest;
import com.sanskriti.backend.dto.response.TransactionResponse;
import com.sanskriti.backend.entity.Transaction;
import com.sanskriti.backend.entity.User;
import com.sanskriti.backend.enums.TransactionStatus;
import com.sanskriti.backend.enums.TransactionType;
import com.sanskriti.backend.exception.ApiException;
import com.sanskriti.backend.mapper.TransactionMapper;
import com.sanskriti.backend.repository.TransactionRepository;
import com.sanskriti.backend.repository.UserRepository;
import com.sanskriti.backend.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final TransactionMapper transactionMapper;

    // ── Admin: Credit user wallet ────────────────────────────────────────────

    @Override
    @Transactional
    public TransactionResponse adminCredit(CreateTransactionRequest request) {
        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new ApiException("User not found: " + request.getUserId(), HttpStatus.NOT_FOUND));

        String txnId = generateTransactionId();

        Transaction transaction = Transaction.builder()
                .transactionId(txnId)
                .userId(user.getUserId())
                .amount(request.getAmount())
                .type(TransactionType.CREDIT)
                .status(TransactionStatus.SUCCESS)
                .paymentMethod("ADMIN_CREDIT")
                .description(request.getDescription() != null
                        ? request.getDescription()
                        : "Admin credit of ₹" + request.getAmount())
                .build();

        transactionRepository.save(transaction);

        user.setWalletBalance(user.getWalletBalance() + request.getAmount());
        userRepository.save(user);

        log.info("Admin credited ₹{} to user: {}", request.getAmount(), user.getUserId());
        return transactionMapper.toResponse(transaction);
    }

    // ── Admin: All Transactions ──────────────────────────────────────────────

    @Override
    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(transactionMapper::toResponse).toList();
    }

    // ── Customer: Own Transactions ───────────────────────────────────────────

    @Override
    public List<TransactionResponse> getMyTransactions(String userId) {
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(transactionMapper::toResponse).toList();
    }

    // ── Shared helper (used by BillServiceImpl) ──────────────────────────────

    static String generateTransactionId() {
        return "TXN-" + Long.toString(System.currentTimeMillis(), 36).toUpperCase()
                + "-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
    }
}
