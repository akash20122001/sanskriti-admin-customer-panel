package com.sanskriti.backend.dto.request;

import com.sanskriti.backend.enums.Currency;
import com.sanskriti.backend.enums.OrderStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CreateOrderRequest {

    // Optional since the backend can auto-generate it if left blank
    private String orderId;

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "SKU ID is required")
    private String skuId;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private Double price;

    @NotNull(message = "Currency is required")
    private Currency currency;

    @NotBlank(message = "Platform is required")
    private String platform;

    private OrderStatus status = OrderStatus.IN_PROGRESS;
    private String deliveryPartner;
    private String trackingId;
    private LocalDateTime orderDate = LocalDateTime.now();
}
