import { useState, useEffect } from 'react';
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
import { ShieldCheck, Zap, Eye, EyeOff, Sparkles } from 'lucide-react';
import logo from '../assets/circle-sanskriti-logo.png';

const loginSchema = z.object({
    userId: z.string().min(3, 'User ID must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading, user, isAuthenticated } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    // Get redirect path or default to appropriate dashboard
    const from = location.state?.from?.pathname;

    // Unified redirect logic for both existing sessions and new logins
    useEffect(() => {
        if (isAuthenticated && user) {
            if (from) {
                // Prevent redirection to unauthorized routes
                // e.g. If Admin was logged in, logged out (saving /admin as 'from'), and then Customer logs in
                if (user.role === 'CUSTOMER' && from.startsWith('/admin')) {
                    navigate('/customer/dashboard', { replace: true });
                    return;
                }
                if (user.role === 'ADMIN' && from.startsWith('/customer')) {
                    navigate('/admin/dashboard', { replace: true });
                    return;
                }

                navigate(from, { replace: true });
            } else {
                const dashboardPath = user.role === 'ADMIN' ? '/admin/dashboard' : '/customer/dashboard';
                navigate(dashboardPath, { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate, from]);

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
            // Navigation is handled by the useEffect above when isAuthenticated becomes true
        } catch (error) {
            toast.error('Login failed', {
                description: (error as Error).message || 'Invalid credentials. Please try again.',
            });
        }
    }

    return (
        <div className="min-h-screen w-full flex bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-dark-bg-primary dark:via-dark-bg-secondary dark:to-dark-bg-tertiary relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-accent-blue/5 to-transparent rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent-purple/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Left Side - Brand Info (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 p-12 flex-col justify-between relative z-10">
                <div className="flex-1 flex flex-col justify-center space-y-8">
                    {/* Logo and Brand */}
                    <div className="space-y-6 animate-in fade-in slide-in-from-left duration-700">
                        <div className="inline-block">
                            <img
                                src={logo}
                                alt="Sanskriti - The Antique"
                                className="h-40 w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent-blue to-accent-purple tracking-tight">
                                Welcome to Sanskriti
                            </h1>
                            <p className="text-2xl font-serif italic text-accent-amber">
                                The Antique
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
                                Experience seamless wallet management, secure transactions, and efficient order tracking—all in one elegant platform.
                            </p>
                        </div>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-left duration-700 delay-200">
                        <div className="group bg-white/60 dark:bg-dark-bg-secondary/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-dark-border/50 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1">
                            <div className="h-14 w-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <ShieldCheck className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Bank-Grade Security</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Your data is protected with enterprise-level encryption</p>
                        </div>

                        <div className="group bg-white/60 dark:bg-dark-bg-secondary/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-dark-border/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                            <div className="h-14 w-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Zap className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Instant transactions and real-time updates</p>
                        </div>

                        <div className="group bg-white/60 dark:bg-dark-bg-secondary/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-dark-border/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 col-span-2">
                            <div className="h-14 w-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Sparkles className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Premium Experience</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Designed for efficiency and elegance at every touchpoint</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-sm text-gray-500 dark:text-gray-400 animate-in fade-in duration-700 delay-300">
                    © {new Date().getFullYear()} Sanskriti - The Antique. All rights reserved.
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
                <Card className="w-full max-w-md shadow-2xl border border-gray-200/50 dark:border-dark-border/50 bg-white/90 backdrop-blur-xl dark:bg-dark-bg-elevated/90 animate-in fade-in zoom-in duration-500">
                    <CardHeader className="space-y-4 pb-8 text-center">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex justify-center mb-4">
                            <img src={logo} alt="Sanskriti Logo" className="h-24 w-auto object-contain drop-shadow-lg" />
                        </div>

                        <div className="space-y-2">
                            <CardTitle className="text-3xl font-bold font-display bg-gradient-to-r from-primary to-accent-blue bg-clip-text text-transparent">
                                Welcome Back
                            </CardTitle>
                            <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                                Sign in to continue to your account
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="userId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">User ID</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your user ID"
                                                    className="h-12 bg-white dark:bg-dark-bg-secondary border-gray-300 dark:border-dark-border focus:ring-2 focus:ring-accent-blue/20 transition-all"
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
                                            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="Enter your password"
                                                        className="h-12 pr-12 bg-white dark:bg-dark-bg-secondary border-gray-300 dark:border-dark-border focus:ring-2 focus:ring-accent-blue/20 transition-all"
                                                        {...field}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-1 top-1 h-10 w-10 px-3 py-2 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded-lg transition-colors"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4 text-gray-500" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-gray-500" />
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
                                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary via-accent-blue to-accent-purple hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Signing In...
                                        </span>
                                    ) : (
                                        'Sign In'
                                    )}
                                </Button>
                            </form>
                        </Form>

                        {/* Divider with text */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200 dark:border-dark-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-dark-bg-elevated px-2 text-gray-500">
                                    Secure Login
                                </span>
                            </div>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck className="h-4 w-4 text-green-600" />
                                <span>Encrypted</span>
                            </div>
                            <div className="h-4 w-px bg-gray-300 dark:bg-dark-border" />
                            <div className="flex items-center gap-1.5">
                                <Sparkles className="h-4 w-4 text-purple-600" />
                                <span>Trusted</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
