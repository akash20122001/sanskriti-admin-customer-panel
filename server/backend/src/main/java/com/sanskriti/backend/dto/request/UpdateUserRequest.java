package com.sanskriti.backend.dto.request;

import com.sanskriti.backend.enums.Role;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * Request DTO for updating an existing user (Admin only).
 *
 * Replaces the update logic in Node.js user.controller.ts:
 *   const { userId, name, password, role, ... } = req.body;
 *   const updateData: any = {};
 *   if (userId) updateData.userId = userId;
 *   ...
 *
 * 🎓 ALL fields are null by default (no @NotBlank) — this is a partial update DTO.
 *   The service checks which fields are non-null and updates only those.
 *   This mirrors the Node.js "updateData" pattern exactly.
 *
 *   Client can send just: { "name": "New Name" }
 *   and only the name will be updated — everything else stays the same.
 */
@Getter
@Setter
public class UpdateUserRequest {

    private String userId;

    private String name;

    @Size(min = 6, message = "password must be at least 6 characters")
    private String password;

    private Role role;

    @Min(value = 0, message = "walletBalance cannot be negative")
    private Double walletBalance;

    private Boolean isActive;

    // Optional company details
    private String company;
    private String email;
    private String phone;
    private String companyAddress;
    private String state;
    private String pin;
    private String gst;
}
