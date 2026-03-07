package com.sanskriti.backend.service;

import com.sanskriti.backend.dto.response.AdminStatsResponse;

public interface DashboardService {
    AdminStatsResponse getAdminStats();
}
