import apiClient from '@/lib/axios';

export interface AdminStats {
    stats: {
        totalUsers: number;
        activeUsers: number;
        totalTransactions: number;
        totalRevenue: number;
    };
    recentActivity: {
        id: string;
        type: string;
        message: string;
        date: string;
        status: string;
    }[];
}

export const dashboardService = {
    async getAdminStats(): Promise<AdminStats> {
        const { data } = await apiClient.get('/dashboard/admin-stats');
        return data.data;
    },
};
