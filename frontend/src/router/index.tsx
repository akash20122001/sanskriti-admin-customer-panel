import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/Login';
import ProtectedRoute from '@/components/ProtectedRoute';
import ComponentDemo from '@/pages/ComponentDemo';
import AdminLayout from '@/layouts/AdminLayout';
import AdminDashboard from '@/pages/admin/Dashboard';
import UsersPage from '@/pages/admin/Users';
import OrdersPage from '@/pages/admin/Orders';

// Placeholder components for future implementation
const CustomerDashboard = () => <div className="p-8"><h1 className="text-2xl font-bold">Customer Dashboard</h1></div>;
const Unauthorized = () => (
    <div className="h-screen flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600">403</h1>
            <p className="text-xl">Unauthorized Access</p>
        </div>
    </div>
);

const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/demo',
        element: <ComponentDemo />,
    },
    {
        path: '/unauthorized',
        element: <Unauthorized />,
    },
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },

    // Admin Routes
    {
        path: '/admin',
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <AdminDashboard />,
                    },
                    {
                        path: 'dashboard',
                        element: <AdminDashboard />,
                    },
                    {
                        path: 'users',
                        element: <UsersPage />,
                    },
                    {
                        path: 'orders',
                        element: <OrdersPage />,
                    },
                ],
            },
        ],
    },

    // Customer Routes
    {
        path: '/customer',
        element: <ProtectedRoute allowedRoles={['CUSTOMER']} />,
        children: [
            {
                path: 'dashboard',
                element: <CustomerDashboard />,
            },
            // Add more customer routes here
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
