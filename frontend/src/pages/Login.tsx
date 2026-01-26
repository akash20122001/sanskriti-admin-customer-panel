import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { ShieldCheck, Clock, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
    userId: z.string().min(3, 'User ID must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    // Get redirect path or default to appropriate dashboard
    const from = location.state?.from?.pathname;

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            userId: '',
            password: '',
        },
    });

    async function onSubmit(data: LoginFormValues) {
        try {
            await login(data);
            toast.success('Login successful', {
                description: 'Welcome back to Sanskriti!',
            });

            // Determine redirect path based on role if no specific redirect exists
            if (!from) {
                const user = useAuthStore.getState().user;
                if (user?.role === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/customer/dashboard');
                }
            } else {
                navigate(from, { replace: true });
            }
        } catch (error) {
            toast.error('Login failed', {
                description: (error as Error).message || 'Invalid credentials. Please try again.',
            });
        }
    }

    return (
        <div className="min-h-screen w-full flex bg-gray-50 dark:bg-dark-bg-primary">
            {/* Left Side - Brand Info (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 bg-white dark:bg-dark-bg-secondary p-12 flex-col justify-between border-r border-gray-200 dark:border-dark-border">
                <div className="space-y-6 mt-20">
                    <h1 className="text-6xl font-display font-bold text-primary dark:text-white tracking-tight">
                        SANSKRITI
                        <br />
                        THE ANTIQUE
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
                        Secure wallet-based ordering & billing system. Manage your finances with confidence.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-12">
                    <div className="bg-gray-50 dark:bg-dark-bg-tertiary p-6 rounded-2xl border border-gray-100 dark:border-dark-border">
                        <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
                            <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">100% Secure</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Enterprise-grade security</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-dark-bg-tertiary p-6 rounded-2xl border border-gray-100 dark:border-dark-border">
                        <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">24/7 Available</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Always accessible access</p>
                    </div>
                </div>

                <div className="text-sm text-gray-400">
                    © {new Date().getFullYear()} Sanskriti The Antique. All rights reserved.
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm dark:bg-dark-bg-elevated/80">
                    <CardHeader className="space-y-2 pb-6">
                        <CardTitle className="text-2xl font-bold font-display">Welcome Back</CardTitle>
                        <CardDescription className="text-base">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="userId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>User ID</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your user ID"
                                                    className="h-12"
                                                    {...field}
                                                />
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
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="Enter your password"
                                                        className="h-12 pr-10"
                                                        {...field}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-10 w-10 px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-gray-400" />
                                                        )}
                                                        <span className="sr-only">
                                                            {showPassword ? 'Hide password' : 'Show password'}
                                                        </span>
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary-light text-white"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Signing In...' : 'Sign In'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="justify-center border-t border-gray-100 dark:border-dark-border pt-6 mt-2">
                        <div className="text-center text-xs text-gray-500 space-y-1">
                            <p>Default Admin: admin / admin123</p>
                            <p>Default Customer: test_user / password123</p>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
