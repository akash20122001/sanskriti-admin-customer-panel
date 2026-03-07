package com.sanskriti.backend.dto.request;

import com.sanskriti.backend.enums.Role;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * Request DTO for creating a new user (Admin only).
 *
 * Replaces the inline destructuring in Node.js user.controller.ts:
 *   const { userId, name, password, role, walletBalance, isActive, ... } = req.body;
 *
 * 🎓 Why a class with @Getter/@Setter (not a Record)?
 *   Consistent with the project's existing DTO style (see LoginRequest, RegisterRequest).
 *   Classes also allow field-level default values directly — no compact constructor trick needed.
 *
 * 🎓 Default values (role, walletBalance, isActive):
 *   Set directly on the field. Jackson (JSON deserializer) respects these —
 *   if the client doesn't send "role" in the JSON body, it stays as CUSTOMER.
 *   This replaces the Node.js pattern:
 *     role: role || 'CUSTOMER'
 *     walletBalance: walletBalance || 0
 *     isActive: isActive !== undefined ? isActive : true
 */
@Getter
@Setter
public class CreateUserRequest {

    @NotBlank(message = "userId is required")
    private String userId;

    @NotBlank(message = "name is required")
    private String name;

    @NotBlank(message = "password is required")
    @Size(min = 6, message = "password must be at least 6 characters")
    private String password;

    // Defaults set here — service can use these directly without null checks
    private Role role = Role.CUSTOMER;

    @Min(value = 0, message = "walletBalance cannot be negative")
    private Double walletBalance = 0.0;

    private Boolean isActive = true;

    // Optional company details — null by default (not required for all users)
    private String company;
    private String email;
    private String phone;
    private String companyAddress;
    private String state;
    private String pin;
    private String gst;
}
