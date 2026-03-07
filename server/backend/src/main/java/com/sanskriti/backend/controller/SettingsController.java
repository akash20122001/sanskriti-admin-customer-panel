package com.sanskriti.backend.controller;

import com.sanskriti.backend.annotation.SuccessMessage;
import com.sanskriti.backend.dto.request.UpdateSettingsRequest;
import com.sanskriti.backend.dto.response.SettingsResponse;
import com.sanskriti.backend.service.SettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping
    @SuccessMessage("Settings fetched successfully")
    public SettingsResponse getSettings() {
        return settingsService.getSettings();
    }

    @PutMapping
    @SuccessMessage("Settings updated successfully")
    public SettingsResponse updateSettings(@Valid @RequestBody UpdateSettingsRequest request) {
        return settingsService.updateSettings(request);
    }
}
