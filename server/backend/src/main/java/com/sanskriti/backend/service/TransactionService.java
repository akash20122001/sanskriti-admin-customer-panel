package com.sanskriti.backend.service;

import com.sanskriti.backend.dto.request.CreateTransactionRequest;
import com.sanskriti.backend.dto.response.TransactionResponse;

import java.util.List;

public interface TransactionService {

    // Admin: credit a user's wallet manually
    TransactionResponse adminCredit(CreateTransactionRequest request);

    // Admin: all transactions with user details
    List<TransactionResponse> getAllTransactions();

    // Customer/Admin: own transactions
    List<TransactionResponse> getMyTransactions(String userId);
}
