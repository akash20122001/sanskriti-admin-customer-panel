package com.sanskriti.backend.controller;

import com.sanskriti.backend.annotation.SuccessMessage;
import com.sanskriti.backend.dto.request.CreateOrderRequest;
import com.sanskriti.backend.dto.request.UpdateOrderRequest;
import com.sanskriti.backend.dto.response.OrderResponse;
import com.sanskriti.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * OrderController
 *
 * 🎓 New Concept: Mixed Role Access on Different Endpoints
 *
 * Unlike UserController (all-ADMIN) or SettingsController (all-ADMIN),
 * orders have DIFFERENT roles per endpoint:
 *   - GET /my-orders → CUSTOMER (their own orders only)
 *   - GET /, POST, PUT, DELETE → ADMIN
 *
 * We do NOT put @PreAuthorize at the class level here.
 * Instead, we put it on EACH method individually.
 *
 * 🎓 New Concept: Reading the Authenticated User in the Controller
 *
 * Spring Security injects the Authentication object into any controller
 * method argument. We call authentication.getName() to get the current
 * user's ID (we set this as the principal in JwtAuthenticationFilter).
 * This replaces the pattern of reading req.userId set by auth middleware.
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // ─── ADMIN ENDPOINTS ───────────────────────────────────────────────────────

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SuccessMessage("Orders fetched successfully")
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SuccessMessage("Order fetched successfully")
    public OrderResponse getOrderById(@PathVariable String id) {
        return orderService.getOrderById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    @SuccessMessage("Order created successfully")
    public OrderResponse createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SuccessMessage("Order updated successfully")
    public OrderResponse updateOrder(
            @PathVariable String id,
            @Valid @RequestBody UpdateOrderRequest request
    ) {
        return orderService.updateOrder(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id);
    }

    // ─── CUSTOMER ENDPOINT ─────────────────────────────────────────────────────

    /**
     * GET /api/orders/my-orders
     *
     * 🎓 authentication.getName() returns the UUID 'id' (the JWT 'sub' claim).
     * But our Order entity stores the userId string (e.g. "cust01"), not the UUID.
     *
     * In JwtAuthenticationFilter we stored the userId as an authentication detail:
     *   authToken.setDetails(Map.of("userId", userId))
     *
     * So we cast getDetails() back to a Map and read the userId from there.
     * This is a deliberate design — the principal is always the stable UUID id,
     * while userId (which can be changed) lives in details.
     */
    @GetMapping("/my-orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    @SuccessMessage("Orders fetched successfully")
    public List<OrderResponse> getMyOrders(Authentication authentication) {
        // authentication.getName() returns the userId (e.g. "akash101")
        // set as the principal in JwtAuthenticationFilter.
        return orderService.getMyOrders(authentication.getName());
    }
}
