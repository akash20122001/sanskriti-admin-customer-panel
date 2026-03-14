import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import logo from '@/assets/circle-sanskriti-logo.png';

/**
 * AppSidebar — unified sidebar for both admin and customer layouts.
 *
 * Previously two separate files (Sidebar.tsx + CustomerSidebar.tsx) that were
 * 80% identical: same mobile toggle, same overlay, same nav loop, same logout.
 * Only the nav items, portal label, and active-path root differed.
 *
 * Now a single component driven by props.
 */
export interface NavItem {
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface AppSidebarProps {
    navItems: NavItem[];
    /** Label shown below the brand name, e.g. "Admin Panel" or "Customer Portal" */
    portalLabel: string;
    /** Root path used to determine if the first nav item is active, e.g. "/admin" or "/customer/dashboard" */
    dashboardPath: string;
}

export default function AppSidebar({ navItems, portalLabel, dashboardPath }: AppSidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => {
        if (path === dashboardPath) {
            // Match both the root and /dashboard alias
            return (
                location.pathname === path ||
                location.pathname === path.replace('/dashboard', '') ||
                location.pathname === path.replace('/dashboard', '') + '/dashboard'
            );
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Mobile toggle button */}
            <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary rounded-xl shadow-lg"
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen
                    ? <X size={24} className="text-white" />
                    : <Menu size={24} className="text-white" />}
            </button>

            {/* Mobile backdrop overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar panel */}
            <aside
                className={`
                    fixed top-0 left-0 h-screen w-64 z-40 shadow-2xl
                    bg-gradient-to-b from-primary to-primary-dark text-white
                    flex flex-col transition-transform duration-300 ease-in-out
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Brand / Logo */}
                <div className="p-6 border-b border-white/10 flex flex-col items-center">
                    <img src={logo} alt="Sanskriti Logo" className="h-24 w-auto mb-3" />
                    <h2 className="text-xl font-bold text-white font-serif tracking-wide text-center">
                        Sanskriti
                        <span className="block text-sm font-normal text-white/80">The Antique</span>
                    </h2>
                    <p className="text-xs font-medium text-white/90 uppercase tracking-wider mt-2 bg-white/10 px-2 py-0.5 rounded-full">
                        {portalLabel}
                    </p>
                </div>

                {/* Navigation links */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl
                                    font-medium transition-all duration-200 group
                                    ${active
                                        ? 'bg-white text-primary shadow-lg'
                                        : 'text-white/90 hover:bg-white/10 hover:text-white'}
                                `}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-primary' : 'text-white/70 group-hover:text-white'}`} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User profile + logout */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-3 py-2 bg-white/10 rounded-xl mb-2">
                        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-base">
                                {user?.name?.[0]?.toUpperCase() ?? '?'}
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white truncate">{user?.name ?? 'User'}</p>
                            <p className="text-xs text-white/60 truncate">{user?.userId}</p>
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
