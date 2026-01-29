import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userService } from '@/services/user.service';
import { toast } from 'sonner';
import type { User } from '@/types';
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

// Validation schema for create
const createUserSchema = z.object({
    userId: z.string()
        .min(3, 'User ID must be at least 3 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'User ID can only contain letters, numbers, underscores, and hyphens'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    active: z.boolean(),
});

// Validation schema for edit
const editUserSchema = z.object({
    userId: z.string().min(3, 'User ID must be at least 3 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
    role: z.enum(['ADMIN', 'CUSTOMER']),
    walletBalance: z.number().min(0, 'Wallet balance cannot be negative'),
    active: z.boolean(),
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
        },
    });

    const editForm = useForm<EditUserFormValues>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            userId: '',
            name: '',
            password: '',
            role: 'CUSTOMER',
            walletBalance: 0,
            active: true,
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
                    role: user.role,
                    walletBalance: user.walletBalance,
                    active: user.isActive,
                });
            } else {
                createForm.reset({
                    userId: '',
                    name: '',
                    password: '',
                    active: true,
                });
            }
        }
    }, [isOpen, user, createForm, editForm]);

    // Validate userId availability for create mode
    const validateUserIdAvailability = async (userId: string) => {
        if (!userId || userId.length < 3) return;

        setValidatingUserId(true);
        try {
            const response = await userService.getUsers();
            const exists = response.users.some((u: User) => u.userId.toLowerCase() === userId.toLowerCase());

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
                    role: editData.role,
                    walletBalance: editData.walletBalance,
                    isActive: editData.active,
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
                <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={() => onClose()} className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting || validatingUserId}
                        form="user-form"
                        className="bg-primary hover:bg-primary-light text-white"
                    >
                        {form.formState.isSubmitting
                            ? isEditMode
                                ? 'Updating...'
                                : 'Creating...'
                            : isEditMode
                                ? 'Update User'
                                : 'Create User'}
                    </Button>
                </DialogFooter>
            }
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" id="user-form">
                    <FormField
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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

                    {/* Only show Role and Wallet fields in edit mode */}
                    {isEditMode && (
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Role *</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white dark:bg-dark-bg-tertiary px-3 py-2 text-sm text-gray-900 dark:text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                            >
                                                <option value="CUSTOMER">Customer</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="walletBalance"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Wallet Balance *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    field.onChange(val === '' ? 0 : parseFloat(val));
                                                }}
                                                onWheel={(e) => e.currentTarget.blur()} // Prevent scroll wheel change
                                                className="bg-white dark:bg-dark-bg-tertiary"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    <FormField
                        control={form.control}
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
        </CommonModal>
    );
}
