import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';
import type { Order } from '@/types';

export function useOrders() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const { data: orders = [], isLoading, error } = useQuery({
        queryKey: ['orders'],
        queryFn: orderService.getAllOrders,
        throwOnError: true,
    });

    const filteredOrders = useMemo(() => {
        const term = searchTerm.toLowerCase();
        if (!term) return orders;
        return orders.filter(
            (o) =>
                o.orderId.toLowerCase().includes(term) ||
                o.userId.toLowerCase().includes(term) ||
                o.skuId.toLowerCase().includes(term),
        );
    }, [searchTerm, orders]);

    const handleModalClose = (refreshData?: boolean) => {
        setIsModalOpen(false);
        setSelectedOrder(null);
        if (refreshData) {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
    };

    const todayOrdersCount = useMemo(() => {
        const today = new Date().toDateString();
        return orders.filter((o) => new Date(o.createdAt).toDateString() === today).length;
    }, [orders]);

    const topPlatform = useMemo(() => {
        if (!orders.length) return 'N/A';
        const counts = orders.reduce((acc, o) => {
            acc[o.platform] = (acc[o.platform] ?? 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? 'N/A';
    }, [orders]);

    return {
        // State
        searchTerm,
        setSearchTerm,
        isModalOpen,
        setIsModalOpen,
        selectedOrder,
        setSelectedOrder,

        // Data & Loading
        orders,
        filteredOrders,
        isLoading,
        error,
        todayOrdersCount,
        topPlatform,

        // Actions
        handleModalClose,
    };
}
