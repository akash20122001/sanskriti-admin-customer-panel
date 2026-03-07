package com.sanskriti.backend.service;

import com.sanskriti.backend.dto.request.CreateOrderRequest;
import com.sanskriti.backend.dto.request.UpdateOrderRequest;
import com.sanskriti.backend.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {

    List<OrderResponse> getAllOrders();

    List<OrderResponse> getMyOrders(String userId);

    OrderResponse getOrderById(String id);

    OrderResponse createOrder(CreateOrderRequest request);

    OrderResponse updateOrder(String id, UpdateOrderRequest request);

    void deleteOrder(String id);
}
