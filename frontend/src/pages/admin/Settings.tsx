import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Assuming you have Button
import { Input } from '@/components/ui/input'; // Assuming you have Input
import { Label } from '@/components/ui/label'; // Assuming you have Label
import { settingsService, type Settings } from '@/services/settings.service';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';

export default function AdminSettings() {
    const [_, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        companyPan: '',
        companyGst: '',
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await settingsService.getSettings();
            setSettings(data);
            setFormData({
                companyPan: data.companyPan,
                companyGst: data.companyGst,
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
            const updated = await settingsService.updateSettings(formData);
            setSettings(updated);
            toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
            console.error(error);
        } finally {
            setSaving(false);
        }
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

            <Card>
                <CardHeader>
                    <CardTitle>Company Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        <div className="pt-4">
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
                </CardContent>
            </Card>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                <p>These details will be displayed in the footer of all generated PDF invoices.</p>
            </div>
        </div>
    );
}
