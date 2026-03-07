package com.sanskriti.backend.service;

import com.sanskriti.backend.dto.request.CreateUserRequest;
import com.sanskriti.backend.dto.request.UpdateUserRequest;
import com.sanskriti.backend.dto.response.UserResponse;

import java.util.List;

/**
 * UserService interface — defines the contract for user management operations.
 *
 * 🎓 Why an Interface?
 *
 * In Spring Boot, it's best practice to define a Service interface + an Impl class.
 * Benefits:
 *   1. Loose coupling — the controller depends on the interface, not the implementation.
 *   2. Easy to swap implementations (e.g., mock in tests).
 *   3. Spring's @Transactional and AOP proxies work better with interfaces.
 *
 * Your Node.js userController was one object with methods.
 * In Spring Boot, we split it:
 *   - Interface (this file) → defines WHAT
 *   - Impl class           → defines HOW
 *   - Controller           → defines the HTTP layer (routes)
 */
public interface UserService {

    /**
     * Get all users.
     * Replaces: prisma.user.findMany({ select: {...}, orderBy: { createdAt: 'desc' } })
     * Route: GET /api/users
     */
    List<UserResponse> getAllUsers();

    /**
     * Get a single user by their UUID primary key (id).
     * Replaces: prisma.user.findUnique({ where: { id } })
     * Route: GET /api/users/:id
     */
    UserResponse getUserById(String id);

    /**
     * Create a new user (Admin only).
     * Replaces: prisma.user.create({ data: { ... } })
     * Route: POST /api/users
     */
    UserResponse createUser(CreateUserRequest request);

    /**
     * Update an existing user (Admin only).
     * Replaces: prisma.user.update({ where: { id }, data: updateData })
     * Route: PUT /api/users/:id
     */
    UserResponse updateUser(String id, UpdateUserRequest request);

    /**
     * Delete a user (Admin only).
     * Replaces: prisma.user.delete({ where: { id } })
     * Route: DELETE /api/users/:id
     */
    void deleteUser(String id);
}
