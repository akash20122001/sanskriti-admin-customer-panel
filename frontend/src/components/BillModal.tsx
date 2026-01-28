import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { billService } from '@/services/bill.service';
import { toast } from 'sonner';
import type { Bill } from '@/types';
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
const billSchema = z.object({
    company: z.string().min(1, 'Company name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
    companyAddress: z.string().min(1, 'Company address is required'),
    state: z.string().min(1, 'State is required'),
    pin: z.string().regex(/^\d{6}$/, 'PIN must be 6 digits'),
    gst: z.string().regex(/^[A-Z0-9]{15}$/, 'GST must be 15 alphanumeric characters (uppercase)'),
    productName: z.string().min(1, 'Product name is required'),
    skuId: z.string().min(1, 'SKU ID is required'),
    quantity: z.number().int().positive('Quantity must be a positive number'),
    price: z.number().positive('Price must be greater than 0'),
    currency: z.enum(['USD', 'INR']),
    shippingCharge: z.number().min(0, 'Shipping charge cannot be negative'),
    taxPercent: z.number().min(0).max(100, 'Tax must be between 0 and 100'),
});

type BillFormValues = z.infer<typeof billSchema>;

interface BillModalProps {
    isOpen: boolean;
    onClose: (refreshData?: boolean) => void;
    bill: Bill | null;
}

export default function BillModal({ isOpen, onClose, bill }: BillModalProps) {
    const isEditMode = !!bill;
    const [payableAmount, setPayableAmount] = useState(0);

    const form = useForm<BillFormValues>({
        resolver: zodResolver(billSchema),
        defaultValues: {
            company: '',
            email: '',
            phone: '',
            companyAddress: '',
            state: '',
            pin: '',
            gst: '',
            productName: '',
            skuId: '',
            quantity: 1,
            price: 0,
            currency: 'INR',
            shippingCharge: 0,
            taxPercent: 0,
        },
    });

    // Calculate payable amount
    const calculatePayableAmount = (quantity: number, price: number, taxPercent: number, shippingCharge: number) => {
        const subtotal = quantity * price;
        const taxAmount = subtotal * (taxPercent / 100);
        const total = subtotal + taxAmount + shippingCharge;
        return parseFloat(total.toFixed(2));
    };

    // Watch form values for calculation
    const watchedValues = form.watch(['quantity', 'price', 'taxPercent', 'shippingCharge']);

    useEffect(() => {
        const [quantity, price, taxPercent, shippingCharge] = watchedValues;
        if (quantity && price) {
            const calculated = calculatePayableAmount(
                quantity,
                price,
                taxPercent || 0,
                shippingCharge || 0
            );
            setPayableAmount(calculated);
        }
    }, [watchedValues]);

    useEffect(() => {
        if (isOpen) {
            if (bill) {
                form.reset({
                    company: bill.company,
                    email: bill.email,
                    phone: bill.phone,
                    companyAddress: bill.companyAddress,
                    state: bill.state,
                    pin: bill.pin,
                    gst: bill.gst,
                    productName: bill.productName,
                    skuId: bill.skuId,
                    quantity: bill.quantity,
                    price: bill.price,
                    currency: bill.currency,
                    shippingCharge: bill.shippingCharge,
                    taxPercent: bill.taxPercent,
                });
                setPayableAmount(bill.payableAmount);
            } else {
                form.reset({
                    company: '',
                    email: '',
                    phone: '',
                    companyAddress: '',
                    state: '',
                    pin: '',
                    gst: '',
                    productName: '',
                    skuId: '',
                    quantity: 1,
                    price: 0,
                    currency: 'INR',
                    shippingCharge: 0,
                    taxPercent: 0,
                });
                setPayableAmount(0);
            }
        }
    }, [isOpen, bill, form]);

    const onSubmit = async (data: BillFormValues) => {
        try {
            const billData = {
                ...data,
                paymentMode: 'Razorpay Wallet',
            };

            await billService.createBill(billData as any);
            toast.success('Bill created successfully! Invoice is being generated...');

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
            title={isEditMode ? 'View Bill' : 'Create New Bill'}
            description={isEditMode ? 'Bill details and invoice.' : 'Fill in the details to generate an invoice.'}
            maxWidth="lg"
            footer={
                !isEditMode ? (
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
                            form="bill-form"
                            className="bg-primary hover:bg-primary/90 text-white"
                        >
                            Create Bill & Generate Invoice
                        </Button>
                    </DialogFooter>
                ) : bill?.invoiceUrl ? (
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={async () => {
                                try {
                                    const url = await billService.downloadInvoice(bill.id);
                                    window.open(url, '_blank');
                                } catch (error) {
                                    toast.error('Failed to open invoice');
                                }
                            }}
                            className="bg-primary hover:bg-primary/90 text-white"
                        >
                            Download Invoice
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="bg-white dark:bg-dark-bg-tertiary text-gray-700 dark:text-gray-300"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                ) : undefined
            }
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="bill-form">
                    {/* Company Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">
                            Company Details
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="company"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Company Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ABC Corp" {...field} className="bg-white dark:bg-dark-bg-tertiary" disabled={isEditMode} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Email *</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="company@example.com" {...field} className="bg-white dark:bg-dark-bg-tertiary" disabled={isEditMode} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Phone *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1234567890" {...field} className="bg-white dark:bg-dark-bg-tertiary" disabled={isEditMode} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="gst"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">GST *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="29ABCDE1234F1Z5"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                className="bg-white dark:bg-dark-bg-tertiary"
                                                disabled={isEditMode}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="companyAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">Company Address *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123 Main Street, City" {...field} className="bg-white dark:bg-dark-bg-tertiary" disabled={isEditMode} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">State *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Maharashtra" {...field} className="bg-white dark:bg-dark-bg-tertiary" disabled={isEditMode} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="pin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">PIN Code *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="400001" {...field} className="bg-white dark:bg-dark-bg-tertiary" disabled={isEditMode} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">
                            Product Details
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="productName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Product Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Winter Jacket" {...field} className="bg-white dark:bg-dark-bg-tertiary" disabled={isEditMode} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="skuId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">SKU ID *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="SKU-12345" {...field} className="bg-white dark:bg-dark-bg-tertiary" disabled={isEditMode} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-[1fr_1fr_140px] gap-4">
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Quantity *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="1"
                                                placeholder="1"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                className="bg-white dark:bg-dark-bg-tertiary"
                                                disabled={isEditMode}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Price *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="99.99"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                className="bg-white dark:bg-dark-bg-tertiary"
                                                disabled={isEditMode}
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isEditMode}>
                                            <FormControl>
                                                <SelectTrigger className="bg-white dark:bg-dark-bg-tertiary">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="INR">INR</SelectItem>
                                                <SelectItem value="USD">USD</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="shippingCharge"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Shipping Charge *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                className="bg-white dark:bg-dark-bg-tertiary"
                                                disabled={isEditMode}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="taxPercent"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Tax % *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="18.00"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                className="bg-white dark:bg-dark-bg-tertiary"
                                                disabled={isEditMode}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">
                            Payment Details
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Payment Mode
                                </label>
                                <div className="p-3 bg-gray-100 dark:bg-dark-bg-tertiary rounded-md">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Razorpay Wallet
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Payable Amount
                                </label>
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                                    <p className="text-lg font-bold text-green-700 dark:text-green-400">
                                        {form.watch('currency') === 'USD' ? '$' : '₹'}{payableAmount.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </CommonModal>
    );
}
