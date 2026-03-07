package com.sanskriti.backend.dto.response;

import com.sanskriti.backend.enums.Currency;
import com.sanskriti.backend.enums.OrderStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class OrderResponse {
    private String id;
    private String orderId;
    private String userId;
    private String skuId;
    private Double price;
    private Currency currency;
    private String platform;
    private OrderStatus status;
    private String deliveryPartner;
    private String trackingId;
    private LocalDateTime orderDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
