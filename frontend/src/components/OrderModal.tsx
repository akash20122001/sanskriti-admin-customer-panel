import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { orderService } from '@/services/order.service';
import { toast } from 'sonner';
import type { Order, Currency, Platform } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
    platform: z.enum(['Amazon', 'Flipkart', 'Meesho', 'Etsy'], {
        message: 'Please select a platform'
    }),
});

type OrderFormValues = z.infer<typeof orderSchema>;

interface OrderModalProps {
    isOpen: boolean;
    onClose: (refreshData?: boolean) => void;
    order: Order | null;
}

export default function OrderModal({ isOpen, onClose, order }: OrderModalProps) {
    const isEditMode = !!order;

    const form = useForm<OrderFormValues>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            userId: '',
            skuId: '',
            price: 0,
            currency: 'USD',
            platform: undefined,
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (order) {
                form.reset({
                    userId: order.userId,
                    skuId: order.skuId,
                    price: order.price,
                    currency: order.currency,
                    platform: order.platform,
                });
            } else {
                form.reset({
                    userId: '',
                    skuId: '',
                    price: 0,
                    currency: 'USD',
                    platform: undefined,
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
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-dark-bg-secondary">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-gray-100">
                        {isEditMode ? 'Edit Order' : 'Add New Order'}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        {isEditMode ? 'Update order details.' : 'Create a new order with the details below.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white dark:bg-dark-bg-tertiary">
                                                <SelectValue placeholder="Select platform" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Amazon">Amazon</SelectItem>
                                            <SelectItem value="Flipkart">Flipkart</SelectItem>
                                            <SelectItem value="Meesho">Meesho</SelectItem>
                                            <SelectItem value="Etsy">Etsy</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                className="bg-primary hover:bg-primary/90 text-white"
                            >
                                {isEditMode ? 'Update Order' : 'Create Order'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
