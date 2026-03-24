import type { Bill } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
};

export const billService = {
    async getAllBills(): Promise<Bill[]> {
        const response = await fetch(`${API_URL}/bills`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch bills');
        }

        const data = await response.json();
        return data.bills;
    },

    async getBillById(id: string): Promise<Bill> {
        const response = await fetch(`${API_URL}/bills/${id}`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch bill');
        }

        const data = await response.json();
        return data.bill;
    },

    async createBill(billData: Omit<Bill, 'id' | 'transactionId' | 'transactionDate' | 'payableAmount' | 'invoiceUrl' | 'createdAt' | 'updatedAt'>): Promise<Bill> {
        const response = await fetch(`${API_URL}/bills`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(billData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create bill');
        }

        const data = await response.json();
        return data.bill;
    },

    async downloadInvoice(billId: string): Promise<string> {
        const bill = await this.getBillById(billId);
        if (!bill.invoiceUrl) {
            throw new Error('Invoice not generated yet');
        }
        return `${API_URL.replace('/api', '')}${bill.invoiceUrl}`;
    },

    async deleteBill(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/bills/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete bill');
        }
    },

    async getCustomerBills(): Promise<any> {
        const response = await fetch(`${API_URL}/bills/customer/my-bills`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch bills');
        }

        const data = await response.json();
        return data;
    },
};
