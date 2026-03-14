import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService, type Settings } from '@/services/settings.service';
import { toast } from 'sonner';

export function useSettings() {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        companyPan: '',
        companyGst: '',
        sellingPlatforms: [] as string[],
        deliveryPartners: [] as string[],
    });

    const [newPlatform, setNewPlatform] = useState('');
    const [newPartner, setNewPartner] = useState('');

    const { isLoading, error } = useQuery({
        queryKey: ['admin-settings'],
        queryFn: async () => {
            const data = await settingsService.getSettings();
            setFormData({
                companyPan: data.companyPan || '',
                companyGst: data.companyGst || '',
                sellingPlatforms: Array.isArray(data.sellingPlatforms) ? data.sellingPlatforms : [],
                deliveryPartners: Array.isArray(data.deliveryPartners) ? data.deliveryPartners : [],
            });
            return data;
        },
        throwOnError: true,
    });

    const mutation = useMutation({
        mutationFn: (data: Partial<Settings>) => settingsService.updateSettings(data),
        onSuccess: () => {
            toast.success('Settings saved successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
        },
        onError: (err) => {
            toast.error('Failed to save settings');
            console.error(err);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    const addPlatform = () => {
        if (newPlatform.trim() && !formData.sellingPlatforms.includes(newPlatform.trim())) {
            setFormData({
                ...formData,
                sellingPlatforms: [...formData.sellingPlatforms, newPlatform.trim()]
            });
            setNewPlatform('');
        }
    };

    const removePlatform = (platform: string) => {
        setFormData({
            ...formData,
            sellingPlatforms: formData.sellingPlatforms.filter(p => p !== platform)
        });
    };

    const addPartner = () => {
        if (newPartner.trim() && !formData.deliveryPartners.includes(newPartner.trim())) {
            setFormData({
                ...formData,
                deliveryPartners: [...formData.deliveryPartners, newPartner.trim()]
            });
            setNewPartner('');
        }
    };

    const removePartner = (partner: string) => {
        setFormData({
            ...formData,
            deliveryPartners: formData.deliveryPartners.filter(p => p !== partner)
        });
    };

    return {
        formData, setFormData,
        newPlatform, setNewPlatform,
        newPartner, setNewPartner,
        isLoading,
        error,
        isSaving: mutation.isPending,
        handleSubmit,
        addPlatform, removePlatform,
        addPartner, removePartner,
    };
}
