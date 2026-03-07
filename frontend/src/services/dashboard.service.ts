const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
};

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
        const response = await fetch(`${API_URL}/dashboard/admin-stats`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch dashboard stats');
        }

        const data = await response.json();
        return data.data;
    },
};
