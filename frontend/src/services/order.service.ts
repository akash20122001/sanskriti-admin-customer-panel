import type { Order, Currency, Platform } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
};

export const orderService = {
    async getAllOrders(): Promise<Order[]> {
        const response = await fetch(`${API_URL}/orders`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch orders');
        }

        const data = await response.json();
        return data.orders;
    },

    async getOrderById(id: string): Promise<Order> {
        const response = await fetch(`${API_URL}/orders/${id}`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch order');
        }

        const data = await response.json();
        return data.order;
    },

    async createOrder(orderData: {
        userId: string;
        skuId: string;
        price: number;
        currency: Currency;
        platform: Platform;
    }): Promise<Order> {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create order');
        }

        const data = await response.json();
        return data.order;
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
        const response = await fetch(`${API_URL}/orders/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update order');
        }

        const data = await response.json();
        return data.order;
    },

    async getCustomerOrders(): Promise<any> {
        const response = await fetch(`${API_URL}/orders/customer/my-orders`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch orders');
        }

        const data = await response.json();
        return data;
    },
};
