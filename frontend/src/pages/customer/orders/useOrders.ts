import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';
import type { Order } from '@/types';

export function useOrders() {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: orders = [], isLoading, error } = useQuery({
        queryKey: ['customer-orders'],
        queryFn: () => orderService.getCustomerOrders().then(res => res || []),
        throwOnError: true,
    });

    const filteredOrders = useMemo(() => {
        const term = searchTerm.toLowerCase();
        if (!term) return orders;
        return (orders as Order[]).filter(
            (o) =>
                o.orderId.toLowerCase().includes(term) ||
                o.skuId.toLowerCase().includes(term) ||
                o.platform.toLowerCase().includes(term)
        );
    }, [searchTerm, orders]);

    return {
        searchTerm, setSearchTerm,
        orders, filteredOrders,
        isLoading, error,
    };
}
