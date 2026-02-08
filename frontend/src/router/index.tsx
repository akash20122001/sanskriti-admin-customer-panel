import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/Login';
import ProtectedRoute from '@/components/ProtectedRoute';
import ComponentDemo from '@/pages/ComponentDemo';
import AdminLayout from '@/layouts/AdminLayout';
import AdminDashboard from '@/pages/admin/Dashboard';
import UsersPage from '@/pages/admin/Users';
import OrdersPage from '@/pages/admin/Orders';
import BillsPage from '@/pages/admin/Bills';
import AdminTransactions from '@/pages/admin/Transactions';
import AdminSettings from '@/pages/admin/Settings';

// Customer Pages
import CustomerLayout from '@/layouts/CustomerLayout';
import CustomerDashboard from '@/pages/customer/Dashboard';
import AddBalance from '@/pages/customer/AddBalance';
import Transactions from '@/pages/customer/Transactions';
import CustomerOrders from '@/pages/customer/Orders';
import CustomerBills from '@/pages/customer/Bills';
import Profile from '@/pages/customer/Profile';

// Public Pages
import TermsPrivacy from '@/pages/TermsPrivacy';

// Components
import RootRedirect from '@/components/RootRedirect';

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
        element: <RootRedirect />,
    },
    {
        path: '/terms-privacy',
        element: <TermsPrivacy />,
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
                    {
                        path: 'bills',
                        element: <BillsPage />,
                    },
                    {
                        path: 'transactions',
                        element: <AdminTransactions />,
                    },
                    {
                        path: 'settings',
                        element: <AdminSettings />,
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
                element: <CustomerLayout />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/customer/dashboard" replace />,
                    },
                    {
                        path: 'dashboard',
                        element: <CustomerDashboard />,
                    },
                    {
                        path: 'add-balance',
                        element: <AddBalance />,
                    },
                    {
                        path: 'transactions',
                        element: <Transactions />,
                    },
                    {
                        path: 'orders',
                        element: <CustomerOrders />,
                    },
                    {
                        path: 'bills',
                        element: <CustomerBills />,
                    },
                    {
                        path: 'profile',
                        element: <Profile />,
                    },
                ],
            },
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
