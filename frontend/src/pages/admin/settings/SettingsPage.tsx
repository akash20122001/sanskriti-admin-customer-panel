import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Plus, X, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { useSettings } from './useSettings';

export default function SettingsPage() {
    const {
        formData, setFormData,
        newPlatform, setNewPlatform,
        newPartner, setNewPartner,
        isLoading, isSaving,
        handleSubmit,
        addPlatform, removePlatform,
        addPartner, removePartner,
    } = useSettings();

    if (isLoading) {
        return <LoadingSpinner message="Loading settings..." fullHeight />;
    }

    return (
        <ErrorBoundary>
            <div className="space-y-6 max-w-2xl mx-auto">
                <PageHeader
                    title="Settings"
                    subtitle="Manage global system settings"
                />

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
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addPlatform();
                                        }
                                    }}
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
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addPartner();
                                        }
                                    }}
                                />
                                <Button type="button" onClick={addPartner} variant="outline" size="icon">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <p className="text-sm text-gray-500">These delivery partners will appear in the order creation form.</p>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={isSaving} className="w-full sm:w-auto text-white">
                            {isSaving ? (
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
        </ErrorBoundary>
    );
}
