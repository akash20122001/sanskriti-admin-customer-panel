import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { settingsService } from '@/services/settings.service';
import { toast } from 'sonner';
import { Save, Loader2, Plus, X } from 'lucide-react';

export default function AdminSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        companyPan: '',
        companyGst: '',
        sellingPlatforms: [] as string[],
        deliveryPartners: [] as string[],
    });
    const [newPlatform, setNewPlatform] = useState('');
    const [newPartner, setNewPartner] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await settingsService.getSettings();
            setFormData({
                companyPan: data.companyPan,
                companyGst: data.companyGst,
                sellingPlatforms: Array.isArray(data.sellingPlatforms) ? data.sellingPlatforms : [],
                deliveryPartners: Array.isArray(data.deliveryPartners) ? data.deliveryPartners : [],
            });
        } catch (error) {
            toast.error('Failed to load settings');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await settingsService.updateSettings(formData);
            toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
            console.error(error);
        } finally {
            setSaving(false);
        }
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage global system settings</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Company Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="pan">Company PAN</Label>
                            <Input
                                id="pan"
                                value={formData.companyPan}
                                onChange={(e) => setFormData({ ...formData, companyPan: e.target.value })}
                                placeholder="Enter PAN Number"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gst">Company GSTIN/UIN</Label>
                            <Input
                                id="gst"
                                value={formData.companyGst}
                                onChange={(e) => setFormData({ ...formData, companyGst: e.target.value })}
                                placeholder="Enter GST Number"
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Selling Platforms</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {formData.sellingPlatforms.map((platform) => (
                                <div
                                    key={platform}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                                >
                                    {platform}
                                    <button
                                        type="button"
                                        onClick={() => removePlatform(platform)}
                                        className="hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5 transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Add new platform (e.g., Amazon, Flipkart)"
                                value={newPlatform}
                                onChange={(e) => setNewPlatform(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPlatform())}
                            />
                            <Button type="button" onClick={addPlatform} variant="outline" size="icon">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-sm text-gray-500">These platforms will appear in the order creation form.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Delivery Partners</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {formData.deliveryPartners.map((partner) => (
                                <div
                                    key={partner}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
                                >
                                    {partner}
                                    <button
                                        type="button"
                                        onClick={() => removePartner(partner)}
                                        className="hover:bg-green-200 dark:hover:bg-green-800/50 rounded-full p-0.5 transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Add new delivery partner (e.g., Delhivery)"
                                value={newPartner}
                                onChange={(e) => setNewPartner(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPartner())}
                            />
                            <Button type="button" onClick={addPartner} variant="outline" size="icon">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-sm text-gray-500">These delivery partners will appear in the order creation form.</p>
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Button type="submit" disabled={saving} className="w-full sm:w-auto text-white">
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                <p>Company details will be displayed in PDF invoices. Platforms and delivery partners can be managed here and will be available in order creation.</p>
            </div>
        </div>
    );
}
