package com.sanskriti.backend.entity;

import com.sanskriti.backend.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
// @Builder.Default is required on fields with initializers — without it, @Builder ignores the default value.
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "User")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 191)
    private String id;

    @Column(length = 191, unique = true, nullable = false)
    private String userId;

    @Column(length = 191, nullable = false)
    private String name;

    @Column(length = 191, nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.CUSTOMER;

    @Column(nullable = false)
    @Builder.Default
    private Double walletBalance = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    // Company Details (optional, for customers)
    @Column(length = 191)
    private String company;

    @Column(length = 191)
    private String email;

    @Column(length = 191)
    private String phone;

    @Column(length = 191)
    private String companyAddress;

    @Column(length = 191)
    private String state;

    @Column(length = 191)
    private String pin;

    @Column(length = 191)
    private String gst;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
