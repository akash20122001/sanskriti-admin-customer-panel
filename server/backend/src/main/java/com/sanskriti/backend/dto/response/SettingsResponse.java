package com.sanskriti.backend.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class SettingsResponse {

    private String id;
    private String companyPan;
    private String companyGst;
    private List<String> sellingPlatforms;
    private List<String> deliveryPartners;
    private LocalDateTime updatedAt;

}
