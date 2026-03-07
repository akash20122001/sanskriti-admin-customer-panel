package com.sanskriti.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * Maps to the Node.js RegisterRequest interface:
 *   interface RegisterRequest { userId: string; name: string; password: string; role?: 'ADMIN' | 'CUSTOMER'; }
 *
 * 'role' is optional — defaults to CUSTOMER in the service layer.
 */
@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Password is required")
    private String password;

    private String role;
}
