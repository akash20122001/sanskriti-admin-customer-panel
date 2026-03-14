import apiClient from '@/lib/axios';

export interface Settings {
    id: string;
    companyPan: string;
    companyGst: string;
    sellingPlatforms: string[]; // NEW: Dynamic selling platforms
    deliveryPartners: string[]; // NEW: Dynamic delivery partners
    updatedAt: string;
}

export const settingsService = {
    async getSettings(): Promise<Settings> {
        const { data } = await apiClient.get('/settings');
        return data.data;
    },

    async updateSettings(data: {
        companyPan?: string;
        companyGst?: string;
        sellingPlatforms?: string[];
        deliveryPartners?: string[];
    }): Promise<Settings> {
        const { data: responseData } = await apiClient.put('/settings', data);
        return responseData.data;
    },
};
