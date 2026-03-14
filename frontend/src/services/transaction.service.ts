import apiClient from '@/lib/axios';

export const transactionService = {
    // Get user's transactions
    async getTransactions() {
        const { data } = await apiClient.get('/transactions', {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
        return data.data;
    },

    // Get all transactions (admin only)
    async getAllTransactions() {
        const { data } = await apiClient.get('/transactions/all');
        return data.data;
    },

    // Create test payment order
    async createTestOrder(amount: number) {
        const { data } = await apiClient.post('/transactions/create-test-order', { amount });
        return data.data;
    },

    // Verify test payment
    async verifyTestPayment(transactionId: string, success: boolean) {
        const { data } = await apiClient.post('/transactions/verify-test-payment', { transactionId, success });
        return data.data;
    },

    // Admin: Credit user wallet
    async adminCredit(userId: string, amount: number, description?: string) {
        const { data } = await apiClient.post('/transactions/admin-credit', { userId, amount, description });
        return data.data;
    },
};
