package com.sanskriti.backend.service;

import com.sanskriti.backend.dto.request.LoginRequest;
import com.sanskriti.backend.dto.request.RegisterRequest;
import com.sanskriti.backend.dto.response.AuthResponse;
import com.sanskriti.backend.dto.response.UserResponse;

/**
 * AuthService Interface — defines the contract for authentication operations.
 *
 * Maps to your Node.js auth.controller.ts functions:
 *   login()    → POST /api/auth/login
 *   register() → POST /api/auth/register
 *   me()       → GET  /api/auth/me
 *
 * 🎓 In Node.js, the business logic lives directly in controllers.
 * In Spring Boot, we add a SERVICE layer between controller and repository:
 *
 *   Controller (handles HTTP) → Service (business logic) → Repository (database)
 *
 * This separation makes the code more testable and reusable.
 */
public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);

    UserResponse me(String id);
}
