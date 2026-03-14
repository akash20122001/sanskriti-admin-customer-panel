import { Outlet } from 'react-router-dom';
import {
    LayoutDashboard, Users, ShoppingCart, FileText,
    CreditCard, Settings, Home, Wallet, Receipt, ShoppingBag, User,
} from 'lucide-react';
import AppSidebar from '@/components/AppSidebar';
import type { NavItem } from '@/components/AppSidebar';
import Header from '@/components/Header';

/**
 * AppLayout — single layout component replacing the identical AdminLayout + CustomerLayout pair.
 *
 * The two old layouts were 100% the same file structure; only the sidebar import differed.
 * Now AppLayout owns the nav config for both roles and passes it down to AppSidebar.
 */

const adminNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Bills', path: '/admin/bills', icon: FileText },
    { name: 'Transactions', path: '/admin/transactions', icon: CreditCard },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
];

const customerNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/customer/dashboard', icon: Home },
    { name: 'Add Balance', path: '/customer/add-balance', icon: Wallet },
    { name: 'Transactions', path: '/customer/transactions', icon: Receipt },
    { name: 'Orders', path: '/customer/orders', icon: ShoppingBag },
    { name: 'Bills', path: '/customer/bills', icon: FileText },
    { name: 'Profile', path: '/customer/profile', icon: User },
];

interface AppLayoutProps {
    role: 'admin' | 'customer';
}

export default function AppLayout({ role }: AppLayoutProps) {
    const isAdmin = role === 'admin';
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary">
            <AppSidebar
                navItems={isAdmin ? adminNavItems : customerNavItems}
                portalLabel={isAdmin ? 'Admin Panel' : 'Customer Portal'}
                dashboardPath={isAdmin ? '/admin' : '/customer/dashboard'}
            />
            <div className="lg:ml-64 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
