import type { User } from '@/types';
import apiClient from '@/lib/axios';

export const userService = {
    async getAllUsers(): Promise<User[]> {
        const { data } = await apiClient.get('/users');
        return data.data;
    },

    async getUserById(id: string): Promise<User> {
        const { data } = await apiClient.get(`/users/${id}`);
        return data.data;
    },

    async createUser(userData: {
        userId: string;
        name: string;
        password: string;
        role: 'ADMIN' | 'CUSTOMER';
        walletBalance?: number;
        isActive?: boolean;
        company?: string;
        email?: string;
        phone?: string;
        companyAddress?: string;
        state?: string;
        pin?: string;
        gst?: string;
    }): Promise<User> {
        const { data } = await apiClient.post('/users', userData);
        return data.data;
    },

    async updateUser(
        id: string,
        userData: {
            userId?: string;
            name?: string;
            password?: string;
            role?: 'ADMIN' | 'CUSTOMER';
            walletBalance?: number;
            isActive?: boolean;
            company?: string | null;
            email?: string | null;
            phone?: string | null;
            companyAddress?: string | null;
            state?: string | null;
            pin?: string | null;
            gst?: string | null;
        }
    ): Promise<User> {
        const { data } = await apiClient.put(`/users/${id}`, userData);
        return data.data;
    },

    async deleteUser(id: string): Promise<void> {
        await apiClient.delete(`/users/${id}`);
    },
};
