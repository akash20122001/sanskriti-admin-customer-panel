package com.sanskriti.backend.service.impl;

import com.sanskriti.backend.dto.response.AdminStatsResponse;
import com.sanskriti.backend.entity.Transaction;
import com.sanskriti.backend.enums.Role;
import com.sanskriti.backend.enums.TransactionStatus;
import com.sanskriti.backend.enums.TransactionType;
import com.sanskriti.backend.repository.TransactionRepository;
import com.sanskriti.backend.repository.UserRepository;
import com.sanskriti.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    @Override
    public AdminStatsResponse getAdminStats() {
        long totalUsers = userRepository.countByRole(Role.CUSTOMER);
        long activeUsers = userRepository.countByRoleAndIsActive(Role.CUSTOMER, true);
        long totalTransactions = transactionRepository.count();
        
        // Revenue is calculated as total SUCCESSful DEBITs (Customer spending money = Company Revenue)
        Double totalRevenue = transactionRepository.sumAmountByTypeAndStatus(TransactionType.DEBIT, TransactionStatus.SUCCESS);
        if (totalRevenue == null) {
            totalRevenue = 0.0;
        }

        // Recent Activity: Get top 5 most recent transactions
        List<AdminStatsResponse.RecentActivity> recentActivity = transactionRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .limit(5)
                .map(txn -> buildActivity(txn))
                .toList();

        return AdminStatsResponse.builder()
                .stats(AdminStatsResponse.Stats.builder()
                        .totalUsers(totalUsers)
                        .activeUsers(activeUsers)
                        .totalTransactions(totalTransactions)
                        .totalRevenue(totalRevenue)
                        .build())
                .recentActivity(recentActivity)
                .build();
    }

    private AdminStatsResponse.RecentActivity buildActivity(Transaction txn) {
        String typeDesc = txn.getType() == TransactionType.DEBIT ? "Payment Received" : "Wallet Credited";
        String msg = String.format("%s for %s (Amount: %.2f)", typeDesc, txn.getUserId(), txn.getAmount());

        return AdminStatsResponse.RecentActivity.builder()
                .id(txn.getId())
                .type("TRANSACTION")
                .message(msg)
                .date(txn.getCreatedAt())
                .status(txn.getStatus().name())
                .build();
    }
}
