import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Home, Wallet, Receipt, ShoppingBag, FileText, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CustomerLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const navigationItems = [
        { name: 'Dashboard', path: '/customer/dashboard', icon: Home },
        { name: 'Add Balance', path: '/customer/add-balance', icon: Wallet },
        { name: 'Transactions', path: '/customer/transactions', icon: Receipt },
        { name: 'Orders', path: '/customer/orders', icon: ShoppingBag },
        { name: 'Bills', path: '/customer/bills', icon: FileText },
        { name: 'Profile', path: '/customer/profile', icon: User },
    ];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-dark-bg">
            {/* Mobile sidebar overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-30 h-full w-64 transform bg-white dark:bg-dark-bg-secondary shadow-lg transition-transform duration-300 lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-2xl font-bold text-primary dark:text-white">Customer Portal</h1>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <button
                                    key={item.path}
                                    onClick={() => {
                                        navigate(item.path);
                                        setIsSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? 'bg-primary text-white'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white dark:bg-dark-bg-secondary shadow-sm z-10">
                    <div className="flex items-center justify-between px-6 py-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                            Welcome to Your Portal
                        </h2>
                        <div className="w-6 lg:w-0" /> {/* Spacer */}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
