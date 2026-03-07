package com.sanskriti.backend.controller;

import com.sanskriti.backend.annotation.SuccessMessage;
import com.sanskriti.backend.dto.response.AdminStatsResponse;
import com.sanskriti.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin-stats")
    @PreAuthorize("hasRole('ADMIN')")
    @SuccessMessage("Admin stats fetched successfully")
    public AdminStatsResponse getAdminStats() {
        return dashboardService.getAdminStats();
    }
}
