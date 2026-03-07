package com.sanskriti.backend.dto.response;

import com.sanskriti.backend.entity.User;
import com.sanskriti.backend.enums.Role;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * Returns user data WITHOUT the password.
 *
 * In Node.js you did:
 *   const { password: _, ...userWithoutPassword } = user;
 *
 * In Java, we create a dedicated DTO class that excludes the password field.
 * The static fromEntity() factory method converts a User entity to this DTO.
 */
@Getter
@Builder
public class UserResponse {

    private String id;
    private String userId;
    private String name;
    private Role role;
    private Double walletBalance;
    private Boolean isActive;
    private String company;
    private String email;
    private String phone;
    private String companyAddress;
    private String state;
    private String pin;
    private String gst;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static UserResponse fromEntity(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .userId(user.getUserId())
                .name(user.getName())
                .role(user.getRole())
                .walletBalance(user.getWalletBalance())
                .isActive(user.getIsActive())
                .company(user.getCompany())
                .email(user.getEmail())
                .phone(user.getPhone())
                .companyAddress(user.getCompanyAddress())
                .state(user.getState())
                .pin(user.getPin())
                .gst(user.getGst())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
