package com.sanskriti.backend.dto.request;

import com.sanskriti.backend.enums.Currency;
import com.sanskriti.backend.enums.OrderStatus;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UpdateOrderRequest {
    
    // Partial update, everything is optional
    private String orderId;
    private String userId;
    private String skuId;
    
    @Min(value = 0, message = "Price cannot be negative")
    private Double price;
    
    private Currency currency;
    private String platform;
    private OrderStatus status;
    private String deliveryPartner;
    private String trackingId;
    private LocalDateTime orderDate;
}
