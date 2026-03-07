package com.sanskriti.backend.mapper;

import com.sanskriti.backend.dto.response.OrderResponse;
import com.sanskriti.backend.entity.Order;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderResponse toResponse(Order order);
}
