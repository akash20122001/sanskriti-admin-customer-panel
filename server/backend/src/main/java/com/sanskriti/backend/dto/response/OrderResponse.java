package com.sanskriti.backend.dto.response;

import com.sanskriti.backend.entity.Order;
import com.sanskriti.backend.enums.Currency;
import com.sanskriti.backend.enums.OrderStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
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

    public static OrderResponse fromEntity(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderId(order.getOrderId())
                .userId(order.getUserId())
                .skuId(order.getSkuId())
                .price(order.getPrice())
                .currency(order.getCurrency())
                .platform(order.getPlatform())
                .status(order.getStatus())
                .deliveryPartner(order.getDeliveryPartner())
                .trackingId(order.getTrackingId())
                .orderDate(order.getOrderDate())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
