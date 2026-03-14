import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userService } from '@/services/user.service';
import { toast } from 'sonner';

import type { User } from '@/types';
import { CommonModal } from '@/components/ui/commonModal';
import { ModalFooter } from '@/components/shared/ModalFooter';

import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

// Validation schema for create
const createUserSchema = z.object({
    userId: z.string()
        .min(3, 'User ID must be at least 3 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'User ID can only contain letters, numbers, underscores, and hyphens'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    active: z.boolean(),
    // Company fields (optional)
    company: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits').optional().or(z.literal('')),
    companyAddress: z.string().optional(),
    state: z.string().optional(),
    pin: z.string().regex(/^\d{6}$/, 'PIN must be 6 digits').optional().or(z.literal('')),
    gst: z.string().regex(/^[A-Z0-9]{15}$/, 'GST must be 15 alphanumeric characters').optional().or(z.literal('')),
});

// Validation schema for edit
const editUserSchema = z.object({
    userId: z.string().min(3, 'User ID must be at least 3 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
    active: z.boolean(),
    // Company fields (optional)
    company: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits').optional().or(z.literal('')),
    companyAddress: z.string().optional(),
    state: z.string().optional(),
    pin: z.string().regex(/^\d{6}$/, 'PIN must be 6 digits').optional().or(z.literal('')),
    gst: z.string().regex(/^[A-Z0-9]{15}$/, 'GST must be 15 alphanumeric characters').optional().or(z.literal('')),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;
type EditUserFormValues = z.infer<typeof editUserSchema>;

interface UserModalProps {
    isOpen: boolean;
    onClose: (refreshData?: boolean) => void;
    user: User | null;
}

export default function UserModal({ isOpen, onClose, user }: UserModalProps) {
    const isEditMode = !!user;
    const [validatingUserId, setValidatingUserId] = useState(false);

    const createForm = useForm<CreateUserFormValues>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            userId: '',
            name: '',
            password: '',
            active: true,
            company: '',
            email: '',
            phone: '',
            companyAddress: '',
            state: '',
            pin: '',
            gst: '',
        },
    });

    const editForm = useForm<EditUserFormValues>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            userId: '',
            name: '',
            password: '',
            active: true,
            company: '',
            email: '',
            phone: '',
            companyAddress: '',
            state: '',
            pin: '',
            gst: '',
        },
    });

    const form = isEditMode ? editForm : createForm;

    // Reset form when user changes or modal opens/closes
    useEffect(() => {
        if (isOpen) {
            if (user) {
                editForm.reset({
                    userId: user.userId,
                    name: user.name,
                    password: '', // Don't populate password for security
                    active: user.isActive,
                    company: user.company || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    companyAddress: user.companyAddress || '',
                    state: user.state || '',
                    pin: user.pin || '',
                    gst: user.gst || '',
                });
            } else {
                createForm.reset({
                    userId: '',
                    name: '',
                    password: '',
                    active: true,
                    company: '',
                    email: '',
                    phone: '',
                    companyAddress: '',
                    state: '',
                    pin: '',
                    gst: '',
                });
            }
        }
    }, [isOpen, user, createForm, editForm]);

    // Validate userId availability for create mode
    const validateUserIdAvailability = async (userId: string) => {
        if (!userId || userId.length < 3) return;

        setValidatingUserId(true);
        try {
            const response = await userService.getAllUsers();
            const exists = response.some((u: User) => u.userId.toLowerCase() === userId.toLowerCase());

            if (exists) {
                createForm.setError('userId', {
                    type: 'manual',
                    message: 'This User ID is already taken',
                });
            } else {
                createForm.clearErrors('userId');
            }
        } catch (error) {
            console.error('Failed to validate userId:', error);
        } finally {
            setValidatingUserId(false);
        }
    };

    const onSubmit = async (data: CreateUserFormValues | EditUserFormValues) => {
        try {
            if (isEditMode) {
                const editData = data as EditUserFormValues;
                // Filter out empty password
                const updateData: any = {
                    userId: editData.userId,
                    name: editData.name,
                    isActive: editData.active,
                    company: editData.company || null,
                    email: editData.email || null,
                    phone: editData.phone || null,
                    companyAddress: editData.companyAddress || null,
                    state: editData.state || null,
                    pin: editData.pin || null,
                    gst: editData.gst || null,
                };

                if (editData.password && editData.password.trim() !== '') {
                    updateData.password = editData.password;
                }

                await userService.updateUser(user!.id, updateData);
                toast.success('User updated successfully');
            } else {
                const createData = data as CreateUserFormValues;
                // Create new user with defaults
                await userService.createUser({
                    userId: createData.userId,
                    name: createData.name,
                    password: createData.password,
                    role: 'CUSTOMER', // Default to CUSTOMER
                    walletBalance: 0, // Default to 0
                    isActive: createData.active,
                    company: createData.company || undefined,
                    email: createData.email || undefined,
                    phone: createData.phone || undefined,
                    companyAddress: createData.companyAddress || undefined,
                    state: createData.state || undefined,
                    pin: createData.pin || undefined,
                    gst: createData.gst || undefined,
                });
                toast.success('User created successfully');
            }

            onClose(true); // Close and refresh data
        } catch (error) {
            toast.error(isEditMode ? 'Failed to update user' : 'Failed to create user', {
                description: (error as Error).message,
            });
        }
    };

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={() => onClose()}
            title={isEditMode ? 'Edit User' : 'Add New User'}
            description={
                isEditMode
                    ? 'Update user information. Leave password blank to keep current password.'
                    : 'Create a new customer account with their details.'
            }
            maxWidth="sm"
            footer={
                <ModalFooter
                    formId="user-form"
                    isEditMode={!!isEditMode}
                    isSubmitting={form.formState.isSubmitting || validatingUserId}
                    onCancel={() => onClose()}
                    createLabel="Create User"
                    updateLabel="Update User"
                />
            }
        >
            <Form {...(form as any)}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" id="user-form">
                    <FormField
                        control={form.control as any}
                        name="userId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 dark:text-gray-300">User ID *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="unique_user_id"
                                        {...field}
                                        disabled={isEditMode}
                                        onBlur={(e) => {
                                            field.onBlur();
                                            if (!isEditMode) {
                                                validateUserIdAvailability(e.target.value);
                                            }
                                        }}
                                        className="bg-white dark:bg-dark-bg-tertiary"
                                    />
                                </FormControl>
                                {validatingUserId && (
                                    <p className="text-sm text-gray-500">Checking availability...</p>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control as any}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 dark:text-gray-300">Full Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} className="bg-white dark:bg-dark-bg-tertiary" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control as any}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 dark:text-gray-300">
                                    Password {!isEditMode && '*'}
                                    {isEditMode && ' (leave blank to keep current)'}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder={isEditMode ? '••••••' : 'Enter password'}
                                        {...field}
                                        className="bg-white dark:bg-dark-bg-tertiary"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Company Details - Show in both create and edit mode */}
                    <div className="space-y-4 pt-4 border-t">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Company Details (Optional)
                        </h4>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control as any}
                                name="company"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Company Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ABC Corp" {...field} className="bg-white dark:bg-dark-bg-tertiary" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control as any}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="company@example.com" {...field} className="bg-white dark:bg-dark-bg-tertiary" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control as any}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1234567890" {...field} className="bg-white dark:bg-dark-bg-tertiary" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control as any}
                                name="gst"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">GST Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="29ABCDE1234F1Z5"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                className="bg-white dark:bg-dark-bg-tertiary"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control as any}
                            name="companyAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">Company Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123 Main Street, City" {...field} className="bg-white dark:bg-dark-bg-tertiary" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control as any}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">State</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Maharashtra" {...field} className="bg-white dark:bg-dark-bg-tertiary" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control as any}
                                name="pin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">PIN Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="400001" {...field} className="bg-white dark:bg-dark-bg-tertiary" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>


                    <FormField
                        control={form.control as any}
                        name="active"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center gap-2">
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={field.onChange}
                                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                        />
                                    </FormControl>
                                    <FormLabel className="!mt-0 cursor-pointer text-gray-700 dark:text-gray-300">Active Account</FormLabel>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </CommonModal >
    );
}
