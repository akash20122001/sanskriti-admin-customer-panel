import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';

export function useDashboard() {
    const queryClient = useQueryClient();

    // Modals
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isBillModalOpen, setIsBillModalOpen] = useState(false);

    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-dashboard'],
        queryFn: dashboardService.getAdminStats,
    });

    const refreshDashboard = () => {
        queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    };

    return {
        stats,
        isLoading,

        // Modal States
        isUserModalOpen, setIsUserModalOpen,
        isOrderModalOpen, setIsOrderModalOpen,
        isBillModalOpen, setIsBillModalOpen,

        refreshDashboard
    };
}
