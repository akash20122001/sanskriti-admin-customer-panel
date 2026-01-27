import type { User } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
};

export const userService = {
    async getAllUsers(): Promise<User[]> {
        const response = await fetch(`${API_URL}/users`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch users');
        }

        const data = await response.json();
        return data.users;
    },

    async getUserById(id: string): Promise<User> {
        const response = await fetch(`${API_URL}/users/${id}`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch user');
        }

        const data = await response.json();
        return data.user;
    },

    async createUser(userData: {
        userId: string;
        name: string;
        password: string;
        role: 'ADMIN' | 'CUSTOMER';
        walletBalance?: number;
        isActive?: boolean;
    }): Promise<User> {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create user');
        }

        const data = await response.json();
        return data.user;
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
        }
    ): Promise<User> {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update user');
        }

        const data = await response.json();
        return data.user;
    },

    async deleteUser(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete user');
        }
    },
};
