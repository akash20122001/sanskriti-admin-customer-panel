package com.sanskriti.backend.dto.response;

import com.sanskriti.backend.enums.Role;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Returns user data WITHOUT the password field.
 * MapStruct (UserMapper) generates the mapping automatically from the User entity.
 */
@Getter
@Setter
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
}
