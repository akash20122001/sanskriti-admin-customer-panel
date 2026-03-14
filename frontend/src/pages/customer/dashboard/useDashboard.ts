import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { transactionService } from '@/services/transaction.service';
import { orderService } from '@/services/order.service';
import { authService } from '@/services/auth.service';
import { billService } from '@/services/bill.service';

export interface DashboardStats {
    walletBalance: number;
    totalTransactions: number;
    totalOrders: number;
    totalBills: number;
}

export function useDashboard() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['customer-dashboard'],
        queryFn: async () => {
            const [userResult, transactionsResult, ordersResult, billsResult] = await Promise.allSettled([
                authService.getCurrentUser(),
                transactionService.getTransactions(),
                orderService.getCustomerOrders(),
                billService.getCustomerBills()
            ]);

            const stats: DashboardStats = {
                walletBalance: 0,
                totalTransactions: 0,
                totalOrders: 0,
                totalBills: 0,
            };

            let recentTransactions: any[] = [];
            let recentOrders: any[] = [];

            if (userResult.status === 'fulfilled' && userResult.value) {
                stats.walletBalance = userResult.value.walletBalance || 0;
            }

            if (transactionsResult.status === 'fulfilled' && transactionsResult.value) {
                const txns = transactionsResult.value.transactions || [];
                stats.totalTransactions = txns.length;
                recentTransactions = txns.slice(0, 5);
            }

            if (ordersResult.status === 'fulfilled' && ordersResult.value) {
                const ords = ordersResult.value.orders || [];
                stats.totalOrders = ords.length;
                recentOrders = ords.slice(0, 5);
            }

            if (billsResult.status === 'fulfilled' && billsResult.value) {
                stats.totalBills = billsResult.value.bills?.length || 0;
            }

            return { stats, recentTransactions, recentOrders };
        },
        throwOnError: true,
    });

    return {
        stats: data?.stats || { walletBalance: 0, totalTransactions: 0, totalOrders: 0, totalBills: 0 },
        recentTransactions: data?.recentTransactions || [],
        recentOrders: data?.recentOrders || [],
        isLoading,
        error
    };
}
