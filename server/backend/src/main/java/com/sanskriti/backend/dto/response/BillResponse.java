package com.sanskriti.backend.dto.response;

import com.sanskriti.backend.enums.Currency;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BillResponse {
    private String id;
    private String transactionId;
    private String invoiceNumber;
    private String userId;
    private LocalDateTime transactionDate;

    // Company Details
    private String company;
    private String email;
    private String phone;
    private String companyAddress;
    private String state;
    private String pin;
    private String gst;
    private String paymentMode;

    // Product Details
    private String productName;
    private String skuId;
    private Integer quantity;
    private Double price;
    private Currency currency;
    private Double shippingCharge;
    private Double packagingCharge;
    private Double taxPercent;
    private Double payableAmount;

    private String invoiceUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
