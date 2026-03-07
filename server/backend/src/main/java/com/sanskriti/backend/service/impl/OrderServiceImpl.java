package com.sanskriti.backend.service.impl;

import com.sanskriti.backend.dto.request.CreateOrderRequest;
import com.sanskriti.backend.dto.request.UpdateOrderRequest;
import com.sanskriti.backend.dto.response.OrderResponse;
import com.sanskriti.backend.entity.Order;
import com.sanskriti.backend.exception.ApiException;
import com.sanskriti.backend.mapper.OrderMapper;
import com.sanskriti.backend.repository.OrderRepository;
import com.sanskriti.backend.repository.UserRepository;
import com.sanskriti.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Override
    public List<OrderResponse> getMyOrders(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Override
    public OrderResponse getOrderById(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ApiException("Order not found", HttpStatus.NOT_FOUND));
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        // Validate referenced user exists
        if (!userRepository.existsByUserId(request.getUserId())) {
            throw new ApiException("User not found with userId: " + request.getUserId(), HttpStatus.NOT_FOUND);
        }

        // Auto-generate Order ID if not provided
        String finalOrderId = request.getOrderId();
        if (finalOrderId == null || finalOrderId.isBlank()) {
            finalOrderId = "ORD-" + java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        }

        // Check for duplicate orderId
        if (orderRepository.findByOrderId(finalOrderId).isPresent()) {
            throw new ApiException("Order ID already exists", HttpStatus.CONFLICT);
        }

        Order order = Order.builder()
                .orderId(finalOrderId)
                .userId(request.getUserId())
                .skuId(request.getSkuId())
                .price(request.getPrice())
                .currency(request.getCurrency())
                .platform(request.getPlatform())
                .status(request.getStatus())
                .deliveryPartner(request.getDeliveryPartner())
                .trackingId(request.getTrackingId())
                .orderDate(request.getOrderDate())
                .build();

        return orderMapper.toResponse(orderRepository.save(order));
    }

    @Override
    @Transactional
    public OrderResponse updateOrder(String id, UpdateOrderRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ApiException("Order not found", HttpStatus.NOT_FOUND));

        // If orderId is being changed, check for conflicts
        if (request.getOrderId() != null && !request.getOrderId().equals(order.getOrderId())) {
            if (orderRepository.findByOrderId(request.getOrderId()).isPresent()) {
                throw new ApiException("Order ID already exists", HttpStatus.CONFLICT);
            }
            order.setOrderId(request.getOrderId());
        }

        if (request.getUserId() != null)        order.setUserId(request.getUserId());
        if (request.getSkuId() != null)         order.setSkuId(request.getSkuId());
        if (request.getPrice() != null)         order.setPrice(request.getPrice());
        if (request.getCurrency() != null)      order.setCurrency(request.getCurrency());
        if (request.getPlatform() != null)      order.setPlatform(request.getPlatform());
        if (request.getStatus() != null)        order.setStatus(request.getStatus());
        if (request.getDeliveryPartner() != null) order.setDeliveryPartner(request.getDeliveryPartner());
        if (request.getTrackingId() != null)    order.setTrackingId(request.getTrackingId());
        if (request.getOrderDate() != null)     order.setOrderDate(request.getOrderDate());

        return orderMapper.toResponse(orderRepository.save(order));
    }

    @Override
    @Transactional
    public void deleteOrder(String id) {
        if (!orderRepository.existsById(id)) {
            throw new ApiException("Order not found", HttpStatus.NOT_FOUND);
        }
        orderRepository.deleteById(id);
    }
}
