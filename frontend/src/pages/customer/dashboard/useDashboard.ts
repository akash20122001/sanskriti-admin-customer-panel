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
                const txns = Array.isArray(transactionsResult.value) ? transactionsResult.value : (transactionsResult.value as any).transactions || [];
                stats.totalTransactions = txns.length;
                recentTransactions = txns.slice(0, 5);
            }

            if (ordersResult.status === 'fulfilled' && ordersResult.value) {
                const ords = Array.isArray(ordersResult.value) ? ordersResult.value : (ordersResult.value as any).orders || [];
                stats.totalOrders = ords.length;
                recentOrders = ords.slice(0, 5);
            }

            if (billsResult.status === 'fulfilled' && billsResult.value) {
                const bils = Array.isArray(billsResult.value) ? billsResult.value : (billsResult.value as any).bills || [];
                stats.totalBills = bils.length;
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
