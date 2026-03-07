package com.sanskriti.backend.dto.response;

import com.sanskriti.backend.enums.TransactionStatus;
import com.sanskriti.backend.enums.TransactionType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TransactionResponse {
    private String id;
    private String transactionId;
    private String userId;
    private Double amount;
    private TransactionType type;
    private TransactionStatus status;
    private String paymentMethod;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
