import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/button';

interface NavItem {
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Transactions', path: '/admin/transactions', icon: CreditCard },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => {
        if (path === '/admin') {
            return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
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

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-screen bg-primary text-white w-64 
          flex flex-col transition-transform duration-300 z-40 shadow-2xl
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Logo Section */}
                <div className="p-6 border-b border-primary-light/30">
                    <h1 className="text-2xl font-display font-bold text-white">
                        SANSKRITI
                    </h1>
                    <p className="text-sm text-gray-300 mt-1 font-medium">Admin Panel</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl
                      transition-all duration-200 font-medium
                      ${active
                                                ? 'bg-white text-primary shadow-lg'
                                                : 'text-gray-200 hover:bg-primary-light hover:text-white'
                                            }
                    `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User Profile Section */}
                <div className="p-4 border-t border-primary-light/30">
                    <div className="flex items-center gap-3 px-4 py-3 bg-primary-light/50 rounded-xl mb-2">
                        <div className="w-10 h-10 bg-accent-blue rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg font-display">
                                {user?.name?.[0]?.toUpperCase() || 'A'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-white truncate">{user?.name || 'Admin User'}</p>
                            <p className="text-xs text-gray-300">{user?.role || 'ADMIN'}</p>
                        </div>
                    </div>

                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-300 hover:text-red-200 hover:bg-red-600/20"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </Button>
                </div>
            </aside>
        </>
    );
}
