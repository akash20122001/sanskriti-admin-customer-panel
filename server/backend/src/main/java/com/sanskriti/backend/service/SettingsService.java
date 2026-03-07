package com.sanskriti.backend.service;

import com.sanskriti.backend.dto.request.UpdateSettingsRequest;
import com.sanskriti.backend.dto.response.SettingsResponse;

public interface SettingsService {
    SettingsResponse getSettings();
    SettingsResponse updateSettings(UpdateSettingsRequest request);
}
