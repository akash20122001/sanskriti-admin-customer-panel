import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Wallet, Receipt, ShoppingBag, FileText, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/button';

interface NavItem {
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/customer/dashboard', icon: Home },
    { name: 'Add Balance', path: '/customer/add-balance', icon: Wallet },
    { name: 'Transactions', path: '/customer/transactions', icon: Receipt },
    { name: 'Orders', path: '/customer/orders', icon: ShoppingBag },
    { name: 'Bills', path: '/customer/bills', icon: FileText },
    { name: 'Profile', path: '/customer/profile', icon: User },
];

export default function CustomerSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => {
        if (path === '/customer/dashboard') {
            return location.pathname === '/customer' || location.pathname === '/customer/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary rounded-xl shadow-lg"
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
            </button>

            {/* Sidebar */}
            <aside
                className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 fixed top-0 left-0 z-40 h-screen w-64 bg-gradient-to-b from-primary to-primary-dark text-white transition-transform duration-300 ease-in-out flex flex-col`}
            >
                {/* Logo/Brand */}
                <div className="p-6 border-b border-white/10 flex flex-col items-center">
                    <img src="/logo.png" alt="Sanskriti Logo" className="h-14 w-auto mb-2" />
                    <h1 className="text-xl font-bold">Customer Portal</h1>
                    <p className="text-sm text-white/70 mt-1">{user?.name || 'Welcome'}</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${active
                                        ? 'bg-white text-primary shadow-lg'
                                        : 'text-white/90 hover:bg-white/10'
                                    }`}
                            >
                                <Icon
                                    className={`w-5 h-5 ${active ? 'text-primary' : 'text-white/70 group-hover:text-white'
                                        }`}
                                />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User info and logout */}
                <div className="p-4 border-t border-white/10">
                    <div className="mb-3 px-2">
                        <p className="text-xs text-white/60">Logged in as</p>
                        <p className="text-sm font-medium truncate">{user?.userId}</p>
                    </div>
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start gap-3 text-white hover:bg-white/10 hover:text-white"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </Button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}
        </>
    );
}
