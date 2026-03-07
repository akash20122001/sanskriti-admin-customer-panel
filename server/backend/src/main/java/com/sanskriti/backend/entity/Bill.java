package com.sanskriti.backend.entity;

import com.sanskriti.backend.enums.Currency;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "Bill")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 191)
    private String id;

    @Column(length = 191, unique = true, nullable = false)
    private String transactionId;

    @Column(length = 191, unique = true)
    private String invoiceNumber;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime transactionDate;

    @Column(length = 191)
    private String userId;

    // Company Details
    @Column(length = 191, nullable = false)
    private String company;

    @Column(length = 191, nullable = false)
    private String email;

    @Column(length = 191, nullable = false)
    private String phone;

    @Column(length = 191, nullable = false)
    private String companyAddress;

    @Column(length = 191, nullable = false)
    private String state;

    @Column(length = 191, nullable = false)
    private String pin;

    @Column(length = 191, nullable = false)
    private String gst;

    @Column(length = 191, nullable = false)
    private String paymentMode = "Razorpay Wallet";

    // Product Details
    @Column(length = 191, nullable = false)
    private String productName;

    @Column(length = 191, nullable = false)
    private String skuId;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Currency currency;

    @Column(nullable = false)
    private Double shippingCharge;

    @Column(nullable = false)
    private Double packagingCharge = 0.0;

    @Column(nullable = false)
    private Double taxPercent;

    // Calculated
    @Column(nullable = false)
    private Double payableAmount;

    // Invoice PDF URL
    @Column(length = 191)
    private String invoiceUrl;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
