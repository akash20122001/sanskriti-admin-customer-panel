import type { Order, Currency, Platform } from '@/types';
import apiClient from '@/lib/axios';

export const orderService = {
    async getAllOrders(): Promise<Order[]> {
        const { data } = await apiClient.get('/orders');
        return data.data;
    },

    async getOrderById(id: string): Promise<Order> {
        const { data } = await apiClient.get(`/orders/${id}`);
        return data.data;
    },

    async createOrder(orderData: {
        userId: string;
        skuId: string;
        price: number;
        currency: Currency;
        platform: Platform;
    }): Promise<Order> {
        const { data } = await apiClient.post('/orders', orderData);
        return data.data;
    },

    async updateOrder(
        id: string,
        orderData: {
            userId?: string;
            skuId?: string;
            price?: number;
            currency?: Currency;
            platform?: Platform;
        }
    ): Promise<Order> {
        const { data } = await apiClient.put(`/orders/${id}`, orderData);
        return data.data;
    },

    async getCustomerOrders(): Promise<Order[]> {
        const { data } = await apiClient.get('/orders/customer/my-orders');
        return data.data;
    },
};
