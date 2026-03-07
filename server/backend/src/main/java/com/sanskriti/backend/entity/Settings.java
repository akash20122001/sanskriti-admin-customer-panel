package com.sanskriti.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "Settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Settings {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 191)
    private String id;

    @Column(length = 191)
    private String companyPan;

    @Column(length = 191)
    private String companyGst;

    @Column(columnDefinition = "json", nullable = false)
    private String sellingPlatforms = "[]";

    @Column(columnDefinition = "json", nullable = false)
    private String deliveryPartners = "[]";

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
