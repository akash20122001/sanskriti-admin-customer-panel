package com.sanskriti.backend.controller;

import com.sanskriti.backend.annotation.SuccessMessage;
import com.sanskriti.backend.dto.request.CreateTransactionRequest;
import com.sanskriti.backend.dto.response.TransactionResponse;
import com.sanskriti.backend.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * TransactionController:
 *   GET  /api/transactions          → Customer: own | Admin: all (handled by role in service)
 *   GET  /api/transactions/all      → Admin: all transactions
 *   POST /api/transactions/admin-credit → Admin: manually credit user wallet
 */
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    /** Customer: returns only their own transactions */
    @GetMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    @SuccessMessage("Transactions fetched successfully")
    public List<TransactionResponse> getMyTransactions(Authentication authentication) {
        return transactionService.getMyTransactions(authentication.getName());
    }

    /** Admin: returns all transactions from all users */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @SuccessMessage("Transactions fetched successfully")
    public List<TransactionResponse> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    /** Admin: manually credit a customer's wallet */
    @PostMapping("/admin-credit")
    @PreAuthorize("hasRole('ADMIN')")
    @SuccessMessage("Wallet credited successfully")
    public TransactionResponse adminCredit(@Valid @RequestBody CreateTransactionRequest request) {
        return transactionService.adminCredit(request);
    }
}
