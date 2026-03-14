import type { Bill } from '@/types';
import apiClient from '@/lib/axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const billService = {
    async getAllBills(): Promise<Bill[]> {
        const { data } = await apiClient.get('/bills');
        return data.data;
    },

    async getBillById(id: string): Promise<Bill> {
        const { data } = await apiClient.get(`/bills/${id}`);
        return data.data;
    },

    async createBill(billData: Omit<Bill, 'id' | 'transactionId' | 'transactionDate' | 'payableAmount' | 'invoiceUrl' | 'createdAt' | 'updatedAt'>): Promise<Bill> {
        const { data } = await apiClient.post('/bills', billData);
        return data.data;
    },

    async downloadInvoice(billId: string): Promise<string> {
        const bill = await this.getBillById(billId);
        if (!bill.invoiceUrl) {
            throw new Error('Invoice not generated yet');
        }
        return `${API_URL.replace('/api', '')}${bill.invoiceUrl}`;
    },

    async getCustomerBills(): Promise<Bill[]> {
        const { data } = await apiClient.get('/bills/customer/my-bills');
        return data.data;
    },
};
