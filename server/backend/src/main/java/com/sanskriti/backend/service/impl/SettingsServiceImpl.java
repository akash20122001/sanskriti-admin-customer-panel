package com.sanskriti.backend.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sanskriti.backend.dto.request.UpdateSettingsRequest;
import com.sanskriti.backend.dto.response.SettingsResponse;
import com.sanskriti.backend.entity.Settings;
import com.sanskriti.backend.exception.ApiException;
import com.sanskriti.backend.repository.SettingsRepository;
import com.sanskriti.backend.service.SettingsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SettingsServiceImpl implements SettingsService {

    private final SettingsRepository settingsRepository;
    private final ObjectMapper objectMapper;

    @Override
    public SettingsResponse getSettings() {
        log.info("Fetching application settings");
        
        // Fetch existing settings or return a default empty instance
        Settings settings = settingsRepository.findFirstBy()
                .orElseGet(() -> {
                    log.info("No settings found, creating default settings");
                    Settings defaultSettings = Settings.builder()
                            .sellingPlatforms("[]")
                            .deliveryPartners("[]")
                            .build();
                    return settingsRepository.save(defaultSettings);
                });

        return mapToResponse(settings);
    }

    @Override
    @Transactional
    public SettingsResponse updateSettings(UpdateSettingsRequest request) {
        log.info("Updating application settings");

        Settings settings = settingsRepository.findFirstBy()
                .orElseGet(() -> Settings.builder()
                        .sellingPlatforms("[]")
                        .deliveryPartners("[]")
                        .build());

        if (request.getCompanyPan() != null) {
            settings.setCompanyPan(request.getCompanyPan());
        }

        if (request.getCompanyGst() != null) {
            settings.setCompanyGst(request.getCompanyGst());
        }

        try {
            if (request.getSellingPlatforms() != null) {
                settings.setSellingPlatforms(objectMapper.writeValueAsString(request.getSellingPlatforms()));
            }

            if (request.getDeliveryPartners() != null) {
                settings.setDeliveryPartners(objectMapper.writeValueAsString(request.getDeliveryPartners()));
            }
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize settings JSON lists", e);
            throw new ApiException("Failed to process settings format", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        Settings savedSettings = settingsRepository.save(settings);
        log.info("Successfully updated settings");
        
        return mapToResponse(savedSettings);
    }

    private SettingsResponse mapToResponse(Settings settings) {
        try {
            List<String> platforms = objectMapper.readValue(
                    settings.getSellingPlatforms() != null ? settings.getSellingPlatforms() : "[]",
                    new TypeReference<>() {}
            );
            
            List<String> partners = objectMapper.readValue(
                    settings.getDeliveryPartners() != null ? settings.getDeliveryPartners() : "[]",
                    new TypeReference<>() {}
            );

            return SettingsResponse.builder()
                    .id(settings.getId())
                    .companyPan(settings.getCompanyPan())
                    .companyGst(settings.getCompanyGst())
                    .sellingPlatforms(platforms)
                    .deliveryPartners(partners)
                    .updatedAt(settings.getUpdatedAt())
                    .build();
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize settings JSON lists", e);
            throw new ApiException("Failed to read settings format", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
