import { ChevronRight } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export default function Header() {
    const location = useLocation();

    // Generate breadcrumbs from path
    const pathSegments = location.pathname.split('/').filter(Boolean);

    const breadcrumbs = pathSegments.map((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        const name = segment.charAt(0).toUpperCase() + segment.slice(1);
        return { name, path };
    });

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 lg:px-6 pl-16 lg:pl-6">
            <div className="flex items-center justify-between">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm flex-wrap" aria-label="Breadcrumb">
                    <Link
                        to={location.pathname.startsWith('/customer') ? '/customer/dashboard' : '/admin'}
                        className="text-gray-600 hover:text-primary transition-colors font-medium"
                    >
                        Home
                    </Link>

                    {breadcrumbs.map((crumb, index) => (
                        <div key={crumb.path} className="flex items-center gap-2">
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            {index === breadcrumbs.length - 1 ? (
                                <span className="text-primary font-semibold">{crumb.name}</span>
                            ) : (
                                <Link
                                    to={crumb.path}
                                    className="text-gray-600 hover:text-primary transition-colors font-medium"
                                >
                                    {crumb.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Right section - Terms & Privacy link */}
                <div className="flex items-center gap-4">
                    <Link
                        to="/terms-privacy"
                        className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                    >
                        Terms & Privacy
                    </Link>
                    <div className="text-xs text-gray-500">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            </div>
        </header>
    );
}
