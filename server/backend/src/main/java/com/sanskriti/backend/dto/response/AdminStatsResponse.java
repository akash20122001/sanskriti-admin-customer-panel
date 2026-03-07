package com.sanskriti.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class AdminStatsResponse {
    private Stats stats;
    private List<RecentActivity> recentActivity;

    @Getter
    @Setter
    @Builder
    public static class Stats {
        private long totalUsers;
        private long activeUsers;
        private long totalTransactions;
        private double totalRevenue;
    }

    @Getter
    @Setter
    @Builder
    public static class RecentActivity {
        private String id;
        private String type; // e.g., 'TRANSACTION', 'ORDER', 'USER'
        private String message;
        private LocalDateTime date;
        private String status;
    }
}
