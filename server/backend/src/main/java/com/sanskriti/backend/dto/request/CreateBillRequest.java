package com.sanskriti.backend.dto.request;

import com.sanskriti.backend.enums.Currency;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBillRequest {

    @NotBlank(message = "userId is required")
    private String userId;

    @NotBlank(message = "productName is required")
    private String productName;

    @NotBlank(message = "skuId is required")
    private String skuId;

    @NotNull(message = "quantity is required")
    @Positive(message = "quantity must be a positive integer")
    private Integer quantity;

    @NotNull(message = "price is required")
    @Positive(message = "price must be greater than 0")
    private Double price;

    @NotNull(message = "currency is required")
    private Currency currency;

    @NotNull(message = "shippingCharge is required")
    @PositiveOrZero(message = "shippingCharge cannot be negative")
    private Double shippingCharge;

    @NotNull(message = "packagingCharge is required")
    @PositiveOrZero(message = "packagingCharge cannot be negative")
    private Double packagingCharge;

    @NotNull(message = "taxPercent is required")
    @DecimalMin(value = "0.0", message = "taxPercent cannot be negative")
    @DecimalMax(value = "100.0", message = "taxPercent cannot exceed 100")
    private Double taxPercent;
}
