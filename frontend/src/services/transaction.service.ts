import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
};

export const transactionService = {
    // Get user's transactions
    async getTransactions() {
        const response = await axios.get(`${API_URL}/transactions`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    },

    // Create test payment order
    async createTestOrder(amount: number) {
        const response = await axios.post(
            `${API_URL}/transactions/create-test-order`,
            { amount },
            { headers: getAuthHeaders() }
        );
        return response.data;
    },

    // Verify test payment
    async verifyTestPayment(transactionId: string, success: boolean) {
        const response = await axios.post(
            `${API_URL}/transactions/verify-test-payment`,
            { transactionId, success },
            { headers: getAuthHeaders() }
        );
        return response.data;
    },

    // Admin: Credit user wallet
    async adminCredit(userId: string, amount: number, description?: string) {
        const response = await axios.post(
            `${API_URL}/transactions/admin-credit`,
            { userId, amount, description },
            { headers: getAuthHeaders() }
        );
        return response.data;
    },
};
