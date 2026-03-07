package com.sanskriti.backend.dto.response;

import lombok.Builder;
import lombok.Getter;

/**
 * Maps to the Node.js response:
 *   res.json({ user: userWithoutPassword, accessToken, refreshToken });
 *
 * This is what the frontend receives after login or register.
 */
@Getter
@Builder
public class AuthResponse {

    private UserResponse user;
    private String accessToken;
    private String refreshToken;
}
