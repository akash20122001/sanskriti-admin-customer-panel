import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

/**
 * RootRedirect component handles the root path ("/")
 * - If user is logged in, redirects to their dashboard (admin or customer)
 * - If user is not logged in, redirects to login page
 */
export default function RootRedirect() {
    const { user, isAuthenticated } = useAuthStore();

    if (isAuthenticated && user) {
        // Redirect to appropriate dashboard based on role
        const dashboardPath = user.role === 'ADMIN' ? '/admin/dashboard' : '/customer/dashboard';
        return <Navigate to={dashboardPath} replace />;
    }

    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
}
