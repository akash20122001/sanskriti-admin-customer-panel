const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
};

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
        const response = await fetch(`${API_URL}/settings`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch settings');
        }
        return response.json();
    },

    async updateSettings(data: {
        companyPan?: string;
        companyGst?: string;
        sellingPlatforms?: string[];
        deliveryPartners?: string[];
    }): Promise<Settings> {
        const response = await fetch(`${API_URL}/settings`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to update settings');
        }
        return response.json();
    },
};
