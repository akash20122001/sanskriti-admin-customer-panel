import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { orderService } from '@/services/order.service';
import { settingsService } from '@/services/settings.service';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { Order } from '@/types';
import { CommonModal } from '@/components/ui/commonModal';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Validation schema
const orderSchema = z.object({
    userId: z.string()
        .min(1, 'User ID is required')
        .regex(/^[a-zA-Z0-9_-]+$/, 'User ID can only contain letters, numbers, underscores, and hyphens'),
    skuId: z.string()
        .min(1, 'SKU ID is required')
        .regex(/^[a-zA-Z0-9_-]+$/, 'SKU ID can only contain letters, numbers, underscores, and hyphens'),
    price: z.number()
        .min(0.01, 'Price must be greater than 0')
        .positive('Price must be positive'),
    currency: z.enum(['USD', 'INR']),
    platform: z.string().min(1, 'Please select a platform'),
    status: z.enum(['IN_PROGRESS', 'SHIPPED', 'RTO']).optional(),
    deliveryPartner: z.string().optional(),
    trackingId: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderSchema>;

interface OrderModalProps {
    isOpen: boolean;
    onClose: (refreshData?: boolean) => void;
    order: Order | null;
}

export default function OrderModal({ isOpen, onClose, order }: OrderModalProps) {
    const isEditMode = !!order;
    const [platforms, setPlatforms] = useState<string[]>([]);
    const [deliveryPartners, setDeliveryPartners] = useState<string[]>([]);
    const [loadingSettings, setLoadingSettings] = useState(true);

    const form = useForm<OrderFormValues>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            userId: '',
            skuId: '',
            price: undefined as any,
            currency: 'USD',
            platform: '',
            status: 'IN_PROGRESS',
            deliveryPartner: '',
            trackingId: '',
        },
    });

    // Fetch platforms and delivery partners from settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await settingsService.getSettings();
                setPlatforms(Array.isArray(settings.sellingPlatforms) ? settings.sellingPlatforms : []);
                setDeliveryPartners(Array.isArray(settings.deliveryPartners) ? settings.deliveryPartners : []);
            } catch (error) {
                console.error('Failed to load settings:', error);
                toast.error('Failed to load platforms and delivery partners');
            } finally {
                setLoadingSettings(false);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (order) {
                form.reset({
                    userId: order.userId,
                    skuId: order.skuId,
                    price: order.price,
                    currency: order.currency,
                    platform: order.platform,
                    status: order.status,
                    deliveryPartner: order.deliveryPartner || '',
                    trackingId: order.trackingId || '',
                });
            } else {
                form.reset({
                    userId: '',
                    skuId: '',
                    price: undefined as any,
                    currency: 'USD',
                    platform: '',
                    status: 'IN_PROGRESS',
                    deliveryPartner: '',
                    trackingId: '',
                });
            }
        }
    }, [isOpen, order, form]);

    const onSubmit = async (data: OrderFormValues) => {
        try {
            if (isEditMode) {
                await orderService.updateOrder(order.id, data);
                toast.success('Order updated successfully');
            } else {
                await orderService.createOrder(data);
                toast.success('Order created successfully');
            }

            form.reset();
            onClose(true);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An error occurred');
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEditMode ? 'Edit Order' : 'Add New Order'}
            description={isEditMode ? 'Update order details.' : 'Create a new order with the details below.'}
            maxWidth="md"
            footer={
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        className="bg-white dark:bg-dark-bg-tertiary text-gray-700 dark:text-gray-300"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="order-form"
                        disabled={form.formState.isSubmitting || loadingSettings}
                        className="bg-primary hover:bg-primary/90 text-white"
                    >
                        {form.formState.isSubmitting && (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        )}
                        {form.formState.isSubmitting
                            ? (isEditMode ? 'Updating...' : 'Creating...')
                            : (isEditMode ? 'Update Order' : 'Create Order')
                        }
                    </Button>
                </DialogFooter>
            }
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" id="order-form">
                    <div className="grid grid-cols-2 gap-4">
                        {/* User ID */}
                        <FormField
                            control={form.control}
                            name="userId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">User ID *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="user123" {...field} className="bg-white dark:bg-dark-bg-tertiary" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* SKU ID */}
                        <FormField
                            control={form.control}
                            name="skuId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">SKU ID *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="SKU-12345" {...field} className="bg-white dark:bg-dark-bg-tertiary" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Price with Currency */}
                    <div className="grid grid-cols-[1fr_140px] gap-4">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">Order Price *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="99.99"
                                            {...field}
                                            value={field.value ?? ''}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                field.onChange(val === '' ? undefined : parseFloat(val));
                                            }}
                                            className="bg-white dark:bg-dark-bg-tertiary"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">Currency *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white dark:bg-dark-bg-tertiary">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="INR">INR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Platform */}
                    <FormField
                        control={form.control}
                        name="platform"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 dark:text-gray-300">Platform *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={loadingSettings}>
                                    <FormControl>
                                        <SelectTrigger className="bg-white dark:bg-dark-bg-tertiary">
                                            <SelectValue placeholder={loadingSettings ? "Loading platforms..." : "Select platform"} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {platforms.length === 0 && !loadingSettings && (
                                            <SelectItem value="none" disabled>No platforms available - Add in Settings</SelectItem>
                                        )}
                                        {platforms.map((platform) => (
                                            <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Delivery Partner & Tracking ID - Always visible */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="deliveryPartner"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">Delivery Partner</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value || undefined}
                                        disabled={loadingSettings}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="bg-white dark:bg-dark-bg-tertiary">
                                                <SelectValue placeholder={loadingSettings ? "Loading..." : "Select partner (optional)"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {deliveryPartners.map((partner) => (
                                                <SelectItem key={partner} value={partner}>{partner}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="trackingId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">Tracking ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter tracking ID" {...field} className="bg-white dark:bg-dark-bg-tertiary" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Status - Only in Edit Mode */}
                    {isEditMode && (
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">Status *</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white dark:bg-dark-bg-tertiary">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                            <SelectItem value="SHIPPED">Shipped</SelectItem>
                                            <SelectItem value="RTO">RTO</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </form>
            </Form>
        </CommonModal>
    );
}
